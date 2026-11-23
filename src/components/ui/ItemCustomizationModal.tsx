'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodItem, CartItemOption } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { X, Check, Plus, Minus } from 'lucide-react';

interface ItemCustomizationModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizations: CartItemOption[], quantity: number) => void;
}

export default function ItemCustomizationModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemCustomizationModalProps) {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CartItemOption[]>>(() => {
    const initial: Record<string, CartItemOption[]> = {};
    item.customizations?.forEach((group) => {
      const defaultOpt = group.options.find((o) => o.is_default);
      if (defaultOpt) {
        initial[group.name] = [
          {
            group_name: group.name,
            option_id: defaultOpt.id,
            option_name: defaultOpt.name,
            price_in_paise: defaultOpt.price_in_paise,
          },
        ];
      } else {
        initial[group.name] = [];
      }
    });
    return initial;
  });

  const handleSingleSelect = (groupName: string, option: { id: string; name: string; price_in_paise: number }) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: [
        {
          group_name: groupName,
          option_id: option.id,
          option_name: option.name,
          price_in_paise: option.price_in_paise,
        },
      ],
    }));
  };

  const handleMultipleSelect = (groupName: string, option: { id: string; name: string; price_in_paise: number }) => {
    setSelectedOptions((prev) => {
      const currentList = prev[groupName] || [];
      const exists = currentList.some((o) => o.option_id === option.id);
      if (exists) {
        return {
          ...prev,
          [groupName]: currentList.filter((o) => o.option_id !== option.id),
        };
      } else {
        return {
          ...prev,
          [groupName]: [
            ...currentList,
            {
              group_name: groupName,
              option_id: option.id,
              option_name: option.name,
              price_in_paise: option.price_in_paise,
            },
          ],
        };
      }
    });
  };

  // Calculate total item price
  const allSelectedOptions = Object.values(selectedOptions).flat();
  const customizationsCost = allSelectedOptions.reduce((acc, curr) => acc + curr.price_in_paise, 0);
  const unitPrice = item.price + customizationsCost;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(allSelectedOptions, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-noir-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="relative h-48 w-full bg-noir-100 overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3.5 h-3.5 border ${
                  item.is_veg ? 'border-emerald-500' : 'border-rose-500'
                } flex items-center justify-center p-0.5 rounded-sm`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>
              <span className="text-xs font-mono tracking-wider uppercase text-noir-300">
                {item.is_veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-xs text-noir-300 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-6 flex-1">
          {item.customizations && item.customizations.length > 0 ? (
            item.customizations.map((group) => {
              const currentGroupSelections = selectedOptions[group.name] || [];

              return (
                <div key={group.id} className="space-y-3 pb-4 border-b border-noir-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-black">{group.name}</h4>
                      <p className="text-xs text-noir-500">
                        {group.type === 'single' ? 'Select 1 option' : 'Optional add-ons'}
                      </p>
                    </div>
                    {group.is_required && (
                      <span className="text-[10px] font-mono uppercase bg-noir-100 text-noir-800 px-2 py-0.5 rounded border border-noir-300">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = currentGroupSelections.some((s) => s.option_id === opt.id);

                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            group.type === 'single'
                              ? handleSingleSelect(group.name, opt)
                              : handleMultipleSelect(group.name, opt)
                          }
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-black bg-noir-50 text-black font-medium'
                              : 'border-noir-200 hover:border-noir-400 text-noir-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-${
                                group.type === 'single' ? 'full' : 'md'
                              } border flex items-center justify-center ${
                                isSelected ? 'border-black bg-black text-white' : 'border-noir-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          <span className="font-mono text-noir-600">
                            {opt.price_in_paise > 0 ? `+${formatCurrency(opt.price_in_paise)}` : 'Free'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-noir-500 italic">No extra customizations required for this dish.</p>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-black">Quantity</span>
            <div className="flex items-center gap-3 bg-noir-100 border border-noir-200 rounded-full px-3 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 hover:text-black text-noir-600 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 hover:text-black text-noir-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Add Button */}
        <div className="p-4 border-t border-noir-200 bg-noir-50/50 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono text-noir-500 uppercase">Item Total</p>
            <p className="text-lg font-bold text-black font-mono">{formatCurrency(totalPrice)}</p>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 max-w-xs py-3 px-6 rounded-full bg-black text-white hover:bg-noir-800 transition-colors text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm"
          >
            Add to Bag • {formatCurrency(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}
