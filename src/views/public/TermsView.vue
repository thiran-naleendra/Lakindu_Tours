<template>
  <div class="bg-background-light min-h-screen font-display pt-32 md:pt-24 pb-20 public-page-pattern">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4">Terms & Conditions</h1>
        <p class="text-slate-600 text-lg">Please read these terms carefully before booking your tour.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-12 border border-slate-100">
        
        <!-- Cancellation Policy -->
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="size-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
              <span class="material-symbols-outlined">warning</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">Cancellation Policy</h2>
          </div>
          <div class="prose max-w-none text-slate-600">
            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <span class="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
                <div>
                  <h3 class="font-bold text-green-800 mb-1">Full Refund</h3>
                  <p class="text-sm">You are eligible for a full refund if the cancellation is made <span class="font-bold">7 days or more</span> before the scheduled pickup time.</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <span class="material-symbols-outlined text-red-600 mt-0.5">cancel</span>
                <div>
                  <h3 class="font-bold text-red-800 mb-1">50% Charge</h3>
                  <p class="text-sm">A 50% cancellation fee applies if the booking is canceled <span class="font-bold">after the journey has started</span> or within 24 hours of the scheduled start time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Payment Terms -->
        <section>
           <div class="flex items-center gap-3 mb-6">
            <div class="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">Payment Terms</h2>
          </div>
          <div class="prose max-w-none text-slate-600">
            <ul class="space-y-4 list-none pl-0">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1">currency_exchange</span>
                <span>Payments are accepted in <span class="font-bold">LKR cash</span>. Foreign currency will be converted using the exchange rate on the day of payment.</span>
              </li>
              <li class="flex items-start gap-3">
                 <span class="material-symbols-outlined text-primary mt-1">block</span>
                <span><span class="font-bold">No advance payment</span> is required to secure your booking.</span>
              </li>
            </ul>
            
            <h3 class="text-lg font-bold text-slate-900 mt-8 mb-4">Payment Schedule</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stage 1</div>
                <div class="font-bold text-slate-900">After Pickup</div>
                <p class="text-sm text-slate-500 mt-1">Initial payment to start the tour.</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stage 2</div>
                <div class="font-bold text-slate-900">Mid-Tour</div>
                <p class="text-sm text-slate-500 mt-1">Second installment during the trip.</p>
              </div>
               <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stage 3</div>
                <div class="font-bold text-slate-900">Final Day</div>
                <p class="text-sm text-slate-500 mt-1">Final balance settlement.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- General Terms -->
        <section class="opacity-70">
           <div class="flex items-center gap-3 mb-6">
            <div class="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <span class="material-symbols-outlined">gavel</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">General Conditions</h2>
          </div>
           <div class="prose max-w-none text-slate-600 text-sm">
            <p class="mb-4">
              <strong>LakDinu Tours</strong> reserves the right to change itineraries or vehicles due to unforeseen circumstances such as weather conditions, road closures, or vehicle breakdowns. In such cases, a suitable alternative will be provided.
            </p>
            <p>
              Passengers are responsible for their personal belongings. LakDinu Tours is not liable for any loss or damage to personal property during the tour. We strongly recommend having travel insurance.
            </p>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '../../composables/useSEO';

useSEO({
    title: 'Terms & Conditions - LakDinu Tours',
    description: 'Read our booking terms, cancellation policy, and payment details.',
    image: 'https://lakdinu-tours.pages.dev/og-image.jpg' // Default OG image
});
</script>
