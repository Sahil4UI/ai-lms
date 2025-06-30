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
import { Card, CardContent } from '@/components/ui/card';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Loader2, Trash2, Edit, PlusCircle, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addCoupon, updateCoupon, deleteCoupon } from './actions';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

type Coupon = {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  usageCount: number;
  createdAt: { seconds: number; nanoseconds: number; };
};

function CouponForm({
  coupon,
  onSuccess,
}: {
  coupon?: Coupon;
  onSuccess: () => void;
}) {
  const action = coupon ? updateCoupon.bind(null, coupon.id) : addCoupon;
  const [state, formAction] = useFormState(action, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success!', description: state.message });
      onSuccess();
    }
    if (state?.error) {
      const errorMessage = typeof state.error === 'string' ? state.error : 'An error occurred.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  }, [state, toast, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="code">Coupon Code</Label>
        <Input id="code" name="code" defaultValue={coupon?.code} required className="uppercase" />
         {state?.error?.code && <p className="text-sm text-destructive mt-1">{state.error.code[0]}</p>}
      </div>
      <div>
        <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
        <Input id="discountPercentage" name="discountPercentage" type="number" defaultValue={coupon?.discountPercentage} required />
        {state?.error?.discountPercentage && <p className="text-sm text-destructive mt-1">{state.error.discountPercentage[0]}</p>}
      </div>
       <div className="flex items-center space-x-2">
        <Switch id="isActive" name="isActive" defaultChecked={coupon ? coupon.isActive : true} />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button type="submit">{coupon ? 'Update' : 'Add'} Coupon</Button>
    </form>
  );
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(firestore, 'coupons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const couponsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
      setCoupons(couponsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this coupon?')) {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast({ title: 'Coupon deleted successfully!' });
      } else {
        toast({ title: 'Error', description: 'Failed to delete coupon.', variant: 'destructive' });
      }
    }
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingCoupon(undefined);
    setIsFormOpen(true);
  };
  
  const closeDialog = () => {
    setIsFormOpen(false);
    setEditingCoupon(undefined);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your courses.</p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onInteractOutside={closeDialog} onEscapeKeyDown={closeDialog}>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit' : 'Add New'} Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm coupon={editingCoupon} onSuccess={closeDialog} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Times Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map(coupon => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.discountPercentage}%</TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.usageCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(coupon)}>
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
