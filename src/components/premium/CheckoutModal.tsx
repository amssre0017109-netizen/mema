import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  CreditCard,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodType } from '../../types/subscription';
import { initiateRazorpayPayment } from '../../services/razorpayService';
import { supabaseService } from '../../services/supabaseService';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    selectedPlanForCheckout,
    activateSubscription,
    currentUser,
    setNotificationToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [upiId, setUpiId] = useState('samar@oksbi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isCheckoutModalOpen || !selectedPlanForCheckout) return null;

  const plan = selectedPlanForCheckout;
  const isTrial = plan.hasFreeTrial;

  const handleInstantSimulateUpgrade = async () => {
    setIsSimulating(true);
    setIsProcessing(true);

    const testPaymentId = `rzp_test_sim_${Date.now()}`;
    const testOrderId = `order_sim_${Date.now()}`;

    try {
      await supabaseService.recordPaymentTransaction({
        userId: currentUser.id,
        razorpayPaymentId: testPaymentId,
        razorpayOrderId: testOrderId,
        amountInr: plan.priceInr,
        planId: plan.id,
        planName: plan.name,
        paymentMethod: 'UPI'
      });
    } catch (e) {
      console.warn('Simulation record note:', e);
    }

    setTimeout(() => {
      setIsSimulating(false);
      setIsProcessing(false);
      activateSubscription(
        plan,
        'UPI',
        `Simulated Test Mode (${testPaymentId.slice(0, 16)})`
      );
      setNotificationToast({
        message: '⚡ VIP Plan Activated (Test Mode)!',
        subtext: `Enjoy ${plan.name} features with ₹0 simulated checkout.`
      });
    }, 600);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (isTrial) {
      setTimeout(() => {
        setIsProcessing(false);
        activateSubscription(plan, 'UPI', '30-Day Student Free Trial');
      }, 800);
      return;
    }

    // Launch official Razorpay Checkout modal
    const initiated = await initiateRazorpayPayment({
      amountInr: plan.priceInr,
      planId: plan.id,
      planName: plan.name,
      userName: currentUser.name,
      onSuccess: async (response) => {
        setIsProcessing(false);

        // Record in Supabase database
        await supabaseService.recordPaymentTransaction({
          userId: currentUser.id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          amountInr: plan.priceInr,
          planId: plan.id,
          planName: plan.name,
          paymentMethod
        });

        // Activate VIP Subscription
        activateSubscription(
          plan,
          paymentMethod,
          `Razorpay ID: ${response.razorpay_payment_id.slice(0, 16)}...`
        );
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setNotificationToast({
          message: 'Payment Cancelled',
          subtext: err?.message || 'Transaction was not completed.'
        });
      }
    });

    if (!initiated) {
      setIsProcessing(false);
      const details = paymentMethod === 'UPI' ? `UPI: ${upiId}` : `Card: ${cardNumber}`;
      activateSubscription(plan, paymentMethod, details);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 text-[#172033] dark:text-slate-100">
        <button
          onClick={() => setIsCheckoutModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#DCE8F7] dark:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Student Checkout</span>
          </div>
          <h2 className="text-xl font-black text-[#172033] dark:text-white font-display">
            {plan.name}
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            {isTrial ? '₹0 today • 1 Month Free Trial' : `₹${plan.priceInr} billed quarterly`}
          </p>
        </div>

        {/* Plan summary */}
        <div className="bg-[#F8FBFF] dark:bg-slate-850 border border-[#DCE8F7] dark:border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between font-bold text-[#172033] dark:text-white">
            <span>Amount Due Today</span>
            <span className="text-base text-[#2563EB] dark:text-blue-400">{isTrial ? '₹0.00 (Free)' : `₹${plan.priceInr}.00`}</span>
          </div>
          {isTrial ? (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              ✓ Free trial for 30 days. Cancel anytime before renewal with 1 tap.
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-[#2563EB] dark:text-blue-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secured by Razorpay • 100% Student Verified</span>
            </div>
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-[#172033] dark:text-slate-200">Select Payment Option:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                paymentMethod === 'UPI'
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-[#DCE8F7] dark:border-slate-700 text-[#172033] dark:text-slate-200 hover:bg-[#F8FBFF] dark:hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4" />
                <span>UPI / GPay</span>
              </div>
              <span className={`text-[10px] block ${paymentMethod === 'UPI' ? 'text-blue-100' : 'text-[#64748B] dark:text-slate-400'}`}>
                PhonePe, Paytm, QR
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                paymentMethod === 'CARD'
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-[#DCE8F7] dark:border-slate-700 text-[#172033] dark:text-slate-200 hover:bg-[#F8FBFF] dark:hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Debit / Card</span>
              </div>
              <span className={`text-[10px] block ${paymentMethod === 'CARD' ? 'text-blue-100' : 'text-[#64748B] dark:text-slate-400'}`}>
                Visa, MasterCard, Rupay
              </span>
            </button>
          </div>
        </div>

        {/* Developer Sandbox / Instant Simulation Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Test Sandbox Mode</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-black uppercase">
              ₹0 Demo
            </span>
          </div>
          <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            Test VIP features without real payment. Simulates an instant Razorpay transaction with ₹0 charged.
          </p>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleInstantSimulateUpgrade}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating ₹0 Activation...' : '⚡ 1-Click Instant Test Upgrade (₹0)'}</span>
          </button>
        </div>

        <form onSubmit={handlePay} className="pt-2 border-t border-[#DCE8F7] dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(false)}
            className="px-4 py-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 font-bold text-xs hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{isProcessing ? 'Processing Gateway...' : isTrial ? 'Start Free Trial' : `Pay ₹${plan.priceInr} via Razorpay`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
