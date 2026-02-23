<template>
    <!-- <img src="../../../img/cementerylayout.jpg" alt=""> -->
     <div class=" h-full w-full bg-amber-200">
        <!-- <h1 class=" text-2xl font-bold text-center py-5">Cementery Map</h1> -->
        <div class=" w-full h-full flex justify-center items-center ">
            <div class=" flex gap-5 w-fit justify-center items-center">
                <div class="flex flex-col gap-10 w-fit">
                    <template class=" flex flex-col " v-for="value in PlotC" :key="value.id">
                        <div class=" bigplot" :class=" value.status === 'Available'? 'bg-green-500' : value.status === 'Reserved'? 'bg-yellow-500' : 'bg-red-500'" @click="openOverlay(value)"><p>{{ value.name }}</p> </div>
                    </template>
                </div>
            
                <div class="flex flex-col gap-10 w-fit">
                    <div class="flex flex-wrap gap-5 w-200">
                        <template class=" " v-for="value in PlotA" :key="value.id">
                            <div class=" plot" :class=" value.status === 'Available'? 'bg-green-500' : value.status === 'Reserved'? 'bg-yellow-500' : 'bg-red-500'" @click="openOverlay(value)"><p>{{ value.name }}</p></div>

                        </template>
                    </div>
                    <div class="flex flex-wrap gap-5 w-200">
                        <template class=" " v-for="value in PlotB" :key="value.id">
                            <div class="plot" :class=" value.status === 'Available'? 'bg-green-500' : value.status === 'Reserved'? 'bg-yellow-500' : 'bg-red-500'" @click="openOverlay(value)"><p>{{ value.name }}</p></div>
                        </template>
                    </div>
                   
                </div>
            </div>
        </div>
     </div>

     <div class=" absolute z-100 w-full h-full top-0 left-0 flex items-center justify-center graybackground" id="overlay" v-show="openOverlayPlot">
        <div class=" bg-white p-5 rounded-md shadow-md opacity-100" v-if="selectedPlot?.status=='Available'">
            <header class=" bg-green-400 p-5 rounded-2xl mb-4">
                <h2 class=" text-xl font-bold">Location: {{ selectedPlot?.id }}</h2>
            </header>
            <p class=" font-bold ">Personal Information</p>
            <input type="text" placeholder="Enter Name" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" v-model="ReservationData.name">
            <input type="number" name="contact" id="contact" placeholder="Enter Contact Number" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" v-model="ReservationData.contact">
            <input type="date" name="schedule" id="schedule" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" v-model="ReservationData.schedule">

            <p class=" font-bold mt-4">Payment Plan</p>
            <input type="number" name="price" id="price" placeholder="Enter Price" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" v-model="ReservationData.price">
            <select name="paymentPlan" id="paymentPlan" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" v-model="ReservationData.paymentPlan">
                <option value="" disabled selected>Select Payment Plan</option>
                <option value="full">Full Payment</option>
                <option value="installment">Installment</option>
            </select>
            <div class=" p-5 bg-gray-300" v-if="ReservationData.paymentPlan === 'installment' && ReservationData.price">
                <p class=" font-bold">Downpayment: {{ ReservationData.price ? (ReservationData.price * 0.3).toFixed(2) : '0.00' }}  </p>
                <p class=" font-bold">Monthly Payment: {{ ReservationData.price ? (ReservationData.price * 0.7 / (12 * 5)).toFixed(2) : '0.00' }}</p>
            </div>
            <div class=" flex justify-between w-full">
                <button class=" mt-4 px-4 py-2 bg-green-500 text-white rounded-md" @click="CreateReservation">Reserve</button>
                <button class=" mt-4 px-4 py-2 bg-red-500 text-white rounded-md" @click="closeOverlay">Cancel</button>
            </div>
            <!-- <button class=" mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" @click="closeOverlay">Close</button> -->
        </div>
        <div class=" bg-white p-5 rounded-md shadow-md opacity-100" v-else>
            <h2 class=" text-xl font-bold mb-4">Plot</h2>
            <p>Plot Name: {{ selectedPlot?.name }}</p>
            <p>Status: {{ selectedPlot?.status }}</p>
            <button class=" mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" @click="closeOverlay">Close</button>
        </div>

     </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { Reservation } from '../../../types/Reservation'; // Import your interface
import { ReserveService } from '../../../utils/ReserveService';
import  { BillingService }  from '../../../utils/BillingService';
import type { Timestamp } from 'firebase/firestore';
import { PaymentService } from '../../../utils/PaymentService';
type Plot = {
    id: string;
    name: string;
    status: 'Reserved' | 'Occupied' | 'Available';
};
// 1. Tell the ref it is an array of Reservations
const reservations = ref<Reservation[]>([]);
let PlotA: Ref<Plot[]> = ref([]);
let PlotB: Ref<Plot[]> = ref([]);
let PlotC: Ref<Plot[]> = ref([]);
reservations.value = JSON.parse(localStorage.getItem('reservations') || '[]');
loadPlots();
onMounted(async () => {
  refreshPlots();
});
const refreshPlots = async () => {
    reservations.value = await ReserveService.getAllReservations();
    localStorage.setItem('reservations', JSON.stringify(reservations.value));
    PlotA.value = [];
    PlotB.value = [];
    PlotC.value = [];
    loadPlots();
}
function loadPlots(){
        for (let i = 1; i <= 20; i++) {
                PlotA.value.push({
                        id: `plotA${i}`,
                        name: `Plot A${i}`,
                        status: getPlotStatus(reservations.value, `plotA${i}`)
                });
                PlotB.value.push({
                        id: `plotB${i}`,
                        name: `Plot B${i}`,
                        status: getPlotStatus(reservations.value, `plotB${i}`)
                });
                // if(i > 3) return;
                
        }
        for (let i = 1; i <= 3; i++) {
            PlotC.value.push({
                        id: `plotC${i}`,
                        name: `Plot C${i}`,
                        status: getPlotStatus(reservations.value, `plotC${i}`)
                });
        }
}

function getPlotStatus(
    reservations: Reservation[],
    plotId: string
): 'Occupied' | 'Reserved' | 'Available' {
    if (reservations.some(r => r.plotId === plotId && r.plotStatus === 'Occupied')) {
        return 'Occupied';
    }
    if (reservations.some(r => r.plotId === plotId && r.plotStatus === 'Reserved')) {
        return 'Reserved';
    }
    return 'Available';
}
let selectedPlot: Ref<Plot | null> = ref(null);
let openOverlayPlot: Ref<boolean> = ref(false);
const openOverlay = (plot: Plot) => {
    selectedPlot.value = plot;
    openOverlayPlot.value = true;
};
const closeOverlay = () => {
    selectedPlot.value = null;
    openOverlayPlot.value = false;
};

type PaymentPlan = 'full' | 'installment' | '';
type ReservationType = {
    name: string;
    contact: string;
    schedule: string;
    price: number | null;
    paymentPlan: PaymentPlan;
};
const ReservationData: Ref<ReservationType> = ref({
    name: '',
    contact: '',
    schedule: '',
    price: null,
    paymentPlan: ''
});

const CreateReservation = async() => {
    if (!selectedPlot.value) return;
    try{
        await BillingService.createBillInfo(
            selectedPlot.value.id,
            ReservationData.value.price || 0,
            parseFloat(ReservationData.value.paymentPlan === 'installment' && ReservationData.value.price ? (ReservationData.value.price * 0.3).toFixed(2) : ReservationData.value.price?.toFixed(2) || '0.00'),
            ReservationData.value.paymentPlan === 'installment' ? 12 * 5 : 1
        );
        const reservationValue: Ref<Reservation> = ref( {
            plotId: selectedPlot.value.id,
            username: ReservationData.value.name,
            contact: String(ReservationData.value.contact),
            scheduledDate: ReservationData.value.schedule,
            plotType: selectedPlot.value.id.startsWith('plotA') ? 'single' : selectedPlot.value.id.startsWith('plotB') ? 'single' : 'monastery',
            created_at: new Date() as unknown as Timestamp,
            plotStatus: 'Reserved',
            price: ReservationData.value.price || 0,
        });
        await ReserveService.reserve(
            reservationValue.value,
            parseFloat(ReservationData.value.paymentPlan === 'installment' && ReservationData.value.price ? (ReservationData.value.price * 0.3).toFixed(2) : ReservationData.value.price?.toFixed(2) || '0.00')
        );

        await PaymentService.processPayment(
            reservationValue.value.plotId,
            reservationValue.value.username,
            reservationValue.value.price * 0.3,
        );
        refreshPlots();
        closeOverlay();
    }catch(error){
        console.error('Error creating reservation:', error);
        return;
    }
    
};
</script>
<style scoped>
.graybackground {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>