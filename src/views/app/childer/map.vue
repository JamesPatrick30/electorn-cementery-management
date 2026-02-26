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
     <div class=" absolute z-100 w-full h-full top-0 left-0 flex items-center justify-center graybackground" id="overlay" v-show="paymentHistorySwitch">
        <div class="p-5 w-100 bg-white rounded-md shadow-md opacity-100">
            <h3 class="font-bold">Payment History</h3>
            <hr>
            <p>Payment: ₱{{ billsMonthly?.monthlyAmount ? (billsMonthly
.monthlyAmount).toFixed(2) : '0.00' }}</p>
            <p>Total Paid: <span class=" font-bold">₱{{ paymentInfo?.totalPaid || 0 }}</span></p>
            <p>Balance: <span class=" font-bold">₱{{ reservedInfo && paymentInfo ? (reservedInfo.price - paymentInfo.totalPaid).toFixed(2) : '0.00' }}</span></p>
            <p>Latest Due Date: <span class=" font-bold">{{ paymentInfo?.latestDueDate ? new Date(paymentInfo.latestDueDate).toLocaleDateString() : 'N/A' }}</span></p>
            <div class="w-full h-64 overflow-auto flex flex-col gap-2">
                <template  v-for="payment in paymentList" :key="payment.id">
                    <div class=" p-2 bg-gray-400 rounded-md">
                        <p>Name: {{ payment.name }}</p>
                        <p>Amount: ₱{{ payment.price }}</p>
                        <p>Date: {{payment.lastPaymentDate ? new Date(payment.lastPaymentDate.toDate?.() || payment.lastPaymentDate).toLocaleDateString() : 'N/A' }}</p>
        
                    </div>
                </template>
            </div>
            <div class=" w-full p-4 flex justify-end">
                <button class=" px-4 py-2 bg-blue-500 text-white rounded-md" @click="paymentHistorySwitch = false">Close</button>
            </div>
        </div>
    </div>
    <div class=" absolute z-100 w-full h-full top-0 left-0 flex items-center justify-center graybackground" id="overlay" v-show="makePaymentSwitch">
        <div class="p-5 w-100 bg-white rounded-md shadow-md opacity-100">
            <h3 class=" font-bold text-2xl">Make Payment</h3>
            <hr>

             <p>Payment: ₱{{ billsMonthly?.monthlyAmount ? (billsMonthly.monthlyAmount).toFixed(2) : '0.00' }}</p>
            <p >Total Paid: <span class=" font-bold">₱{{ paymentInfo?.totalPaid || 0 }}</span></p>
            <p >Balance: <span class=" font-bold">₱{{ reservedInfo && paymentInfo ? (reservedInfo.price - paymentInfo.totalPaid).toFixed(2) : '0.00' }}</span></p>
            <p >Latest Due Date: <span class=" font-bold">{{ paymentInfo?.latestDueDate ? new Date(paymentInfo.latestDueDate).toLocaleDateString() : 'N/A' }}</span></p>

            <input type="text" placeholder="Enter Name" class=" border border-gray-300 rounded-md px-3 py-2 mb-4 mt-3 w-full" v-model="nameOfThePayment">
            <div class=" w-full p-4 flex justify-between">
                <button class=" px-4 py-2 bg-red-500 text-white rounded-md" @click="makePaymentSwitch = false">Close</button>
                <button class=" px-4 py-2 bg-green-500 text-white rounded-md" @click="makePayment">Pay Now</button>
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
        <div class=" bg-white p-5 rounded-md shadow-md opacity-100 w-110" v-else>
            <h2 class=" text-xl font-bold">Plot ID: {{ reservedInfo?.plotId }}</h2>
            <p class=" text-sm mb-4">Type: {{ reservedInfo?.plotType }}</p>
            <div class=" shadow-2xl p-5 rounded-lg bg-gray-300 mb-5">
                <Strong class="font-bold">Owner Details</Strong>
                <hr>
                <p>User: {{ reservedInfo?.username }}</p>
                <p>Contact: {{ reservedInfo?.contact }}</p>
            </div>

            <div class=" shadow-2xl p-5 rounded-lg bg-gray-300 mb-5">

                <strong class="font-bold">Payment Status</strong>
                <hr>
                <p>Price: ₱{{ reservedInfo?.price || 0 }}</p>
                <p>Total Paid: ₱{{ paymentInfo?.totalPaid || 0 }}</p>
                <p>Balance: ₱{{ reservedInfo && paymentInfo ? (reservedInfo.price - paymentInfo.totalPaid).toFixed(2) : '0.00' }}</p>
                <p v-if="paymentInfo?.totalPaid != reservedInfo?.price">Latest Due Date: {{ paymentInfo?.latestDueDate ? new Date(paymentInfo.latestDueDate).toLocaleDateString() : 'N/A' }}</p>
                <div class="w-full p-3 flex justify-between">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm" v-if="paymentInfo?.totalPaid && reservedInfo?.price && paymentInfo.totalPaid < reservedInfo.price" @click="openPaymentModal">Make Payment</button>
                    <button class="px-4 py-2 bg-violet-500 text-white rounded-md text-sm" @click="historyPayment">History</button>
                </div>
                
            </div>
            <div class=" shadow-2xl p-5 rounded-lg bg-gray-300 mb-5">
                <strong class="font-bold">Deceased List</strong>
                <hr>
                <div class=" h-20 overflow-auto">
                    <div class=" p-3 bg-gray-400 m-1 rounded-2xl" v-for="value in deceasedList" :key="value.id">
                        <p>Name: {{ value.name }}</p>
                        <p>Date of Death: {{ value.dateOfDeath }}</p>
                    </div>
                </div>
                
                
            </div>
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
import { DeceasedService } from '../../../utils/DeceasedService';
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

async function getPlotReservedInfo(plotId: string){
    const reservedInfo = await ReserveService.getByPlotId(plotId);
    console.log('Reserved Info for', plotId, ':', reservedInfo);
    return reservedInfo;
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
type PaymentInfo = {
    latestDueDate: Date | null;
    totalPaid: number;
} | null;
const deceasedList: Ref<any> = ref(null);
const paymentInfo: Ref<PaymentInfo> = ref(null);
const reservedInfo: Ref<Reservation | null> = ref(null);
const openOverlay = async (plot: Plot) => {
    selectedPlot.value = plot;
    if(plot.status === 'Reserved' || plot.status === 'Occupied'){
        reservedInfo.value = await getPlotReservedInfo(plot.id);
        paymentInfo.value = await PaymentService.getPaymentSummary(plot.id);
        deceasedList.value =await DeceasedService.getByPlot(plot.id) || null;
        console.log('Deceased List for', plot.id, ':', deceasedList.value);
        console.log('Payment Info for', plot.id, ':', paymentInfo.value);
    }
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
        ReservationData.value = {
            name: '',
            contact: '',
            schedule: '',
            price: null,
            paymentPlan: ''
        };
        // await PaymentService.processPayment(
        //     reservationValue.value.plotId,
        //     reservationValue.value.username,
        //     parseFloat(ReservationData.value.paymentPlan === 'installment' && ReservationData.value.price ? (ReservationData.value.price * 0.3).toFixed(2) : ReservationData.value.price?.toFixed(2) || '0.00'),
        // );
        refreshPlots();
        closeOverlay();
    }catch(error){
        console.error('Error creating reservation:', error);
        return;
    }
    
};
const billsMonthly: Ref<any> = ref(null);
const openPaymentModal = async () => {
    // Implement your logic to open the payment modal here
    makePaymentSwitch.value = true;
    billsMonthly.value = await BillingService.getMonthlyDues(selectedPlot.value?.id || '');
    closeOverlay();
};
const paymentList: Ref<any[]> = ref([]);
const historyPayment = async () => {
    // Implement your logic to show payment history here
    paymentList.value =await PaymentService.getAllPayments(reservedInfo.value?.plotId || '');
    console.log('Payment List for', reservedInfo.value?.plotId, ':', paymentList.value);
    paymentHistorySwitch.value = true;
    closeOverlay();

    // alert('Show Payment History');
};
const makePaymentSwitch: Ref<boolean> = ref(false);

const nameOfThePayment: Ref<string> = ref('');

const makePayment = async () => {
    // console.log('Making payment for plot:', selectedPlot.value?.id);
    if (!reservedInfo.value) return;
    try {
        await PaymentService.processPayment(
            reservedInfo?.value.plotId,
            nameOfThePayment.value,
            billsMonthly.value?.monthlyAmount || 0
        );
        alert('Payment Successful');
        makePaymentSwitch.value = false;
        refreshPlots();
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Payment Failed');
    }
};

const paymentHistorySwitch: Ref<boolean> = ref(false);
</script>
<style scoped>
.graybackground {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>