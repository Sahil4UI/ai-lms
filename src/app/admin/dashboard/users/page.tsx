'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, getDocs, query, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Loader2, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateTrainerRevenueShare } from './actions';
import type { UserData } from '@/hooks/use-auth';


function RevenueShareForm({
  trainer,
  onSuccess,
}: {
  trainer: UserData;
  onSuccess: () => void;
}) {
  const action = updateTrainerRevenueShare.bind(null, trainer.uid);
  const [state, formAction] = useFormState(action, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success!', description: state.message });
      onSuccess();
    }
    if (state?.error && typeof state.error === 'string') {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
  }, [state, toast, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
        <div>
            <p className="font-medium">{trainer.displayName}</p>
            <p className="text-sm text-muted-foreground">{trainer.email}</p>
        </div>
        <div>
            <Label htmlFor="revenueShare">Revenue Share (%)</Label>
            <Input
            id="revenueShare"
            name="revenueShare"
            type="number"
            defaultValue={trainer.revenueSharePercentage || 70} // Default to 70% if not set
            required
            />
            {typeof state?.error !== 'string' && state?.error?.revenueShare && (
              <p className="text-sm text-destructive mt-1">{state.error.revenueShare[0]}</p>
            )}
        </div>
        <Button type="submit">Update Share</Button>
    </form>
  );
}


export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'students' | 'trainers'>('all');
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<UserData | undefined>(undefined);

  const fetchUsers = async () => {
    setLoading(true);
    if (!firestore) {
      toast({ title: "Error", description: "Firestore not configured", variant: "destructive" });
      setUsers([]);
      setLoading(false);
      return;
    }
    try {
      const usersCol = collection(firestore, 'users');
      // Removed orderBy to prevent query failures if index is not created
      const q = query(usersCol);
      const usersSnapshot = await getDocs(q);
      const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));
      
      // Sort manually on the client
      usersData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({ title: "Error", description: "Could not fetch user data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);
  
  const handleEditClick = (trainer: UserData) => {
    setEditingTrainer(trainer);
    setIsFormOpen(true);
  };
  
  const closeDialog = () => {
      setIsFormOpen(false);
      setEditingTrainer(undefined);
      fetchUsers(); // Re-fetch users to show updated data
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'students') return user.role === 'student';
    if (filter === 'trainers') return user.role === 'trainer';
    return false;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>View and manage all registered users. You can set revenue sharing for trainers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="trainers">Trainers</TabsTrigger>
            </TabsList>
          </Tabs>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined At</TableHead>
                  <TableHead>Revenue Share (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName} />
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{user.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role ? (
                          <Badge variant={user.role === 'trainer' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                      ) : (
                          <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date((user.createdAt as any).seconds * 1000).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.role === 'trainer' ? (
                        <div className="flex items-center gap-2">
                            <span>{user.revenueSharePercentage !== undefined ? user.revenueSharePercentage : 'N/A'}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(user)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onInteractOutside={closeDialog} onEscapeKeyDown={closeDialog}>
            <DialogHeader>
                <DialogTitle>Set Revenue Share</DialogTitle>
            </DialogHeader>
            {editingTrainer && <RevenueShareForm trainer={editingTrainer} onSuccess={closeDialog} />}
        </DialogContent>
      </Dialog>

    </div>
  );
}
