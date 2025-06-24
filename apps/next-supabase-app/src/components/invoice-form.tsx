import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@beach-box/unify-ui';
import { calculateInvoiceTotal } from '@/lib/utils';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  qty: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_price_cents: z.coerce.number().min(1, 'Price must be greater than 0'),
});

const invoiceFormSchema = z.object({
  customer_email: z.string().email('Invalid email address'),
  due_date: z.string().min(1, 'Due date is required'),
  currency: z.string().default('USD'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<InvoiceFormValues>;
}

export default function InvoiceForm({
  onSubmit,
  isLoading = false,
  defaultValues = {
    currency: 'USD',
    items: [{ description: '', qty: 1, unit_price_cents: 0 }],
  },
}: InvoiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const total = calculateInvoiceTotal(items || []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Customer Email"
          type="email"
          {...register('customer_email')}
          error={errors.customer_email?.message}
        />
        <Input
          label="Due Date"
          type="date"
          {...register('due_date')}
          error={errors.due_date?.message}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Line Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: '', qty: 1, unit_price_cents: 0 })}
          >
            Add Item
          </Button>
        </div>

        {errors.items?.message && (
          <p className="text-sm text-red-600 mb-2">{errors.items.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-start border border-gray-200 rounded-md p-3"
            >
              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Description"
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description?.message}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  label="Qty"
                  type="number"
                  min="1"
                  {...register(`items.${index}.qty`)}
                  error={errors.items?.[index]?.qty?.message}
                />
              </div>
              <div className="col-span-8 md:col-span-3">
                <Input
                  label="Unit Price (cents)"
                  type="number"
                  min="0"
                  {...register(`items.${index}.unit_price_cents`)}
                  error={errors.items?.[index]?.unit_price_cents?.message}
                />
              </div>
              <div className="col-span-12 md:col-span-1 md:pt-7">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                    className="w-full md:w-auto"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-4">
        <div>
          <p className="text-lg font-semibold">Total: ${(total / 100).toFixed(2)}</p>
        </div>
        <Button type="submit" isLoading={isLoading}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
}