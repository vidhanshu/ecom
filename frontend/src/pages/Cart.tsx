import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, useCartStore } from "@/store";

export default function CartPage() {
  const { user } = useAuthStore();
  const { items, remove, clear, syncFromServer } = useCartStore();
  const { toast } = useToast();

  const removeOne = async (itemId) => {
    if (!user) return;
    try {
      await remove(itemId, 1);
      toast({ title: "Item removed from cart" });
    } catch {
      toast({ title: "Failed to remove item from cart" });
      await syncFromServer();
    }
  };
  const removeAll = async (itemId) => {
    if (!user) return;
    try {
      await remove(itemId);
      toast({ title: "Item removed from cart" });
    } catch {
      toast({ title: "Failed to remove item from cart" });
      await syncFromServer();
    }
  };
  const clearCart = async () => {
    if (!user) return;
    try {
      await clear();
      toast({ title: "Cart cleared" });
    } catch {
      toast({ title: "Failed to clear cart" });
      await syncFromServer();
    }
  };

  const total = items.reduce(
    (sum, c) => sum + (c.item?.price || 0) * c.quantity,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cart</h2>
        {items.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all items from your cart. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearCart}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {items.length === 0 && <div>Your cart is empty.</div>}
      <div className="space-y-4">
        {items.map((c) => (
          <div
            key={c.itemId}
            className="flex items-center gap-4 border p-3 rounded"
          >
            <img
              src={c.item?.image}
              alt={c.item?.title}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-medium">{c.item?.title}</div>
              <div className="text-sm text-muted-foreground">
                Qty: {c.quantity}
              </div>
              <div className="text-sm">
                ₹{(c.item?.price || 0) * c.quantity}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => removeOne(c.itemId)}>
                -1
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => removeAll(c.itemId)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right font-semibold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
