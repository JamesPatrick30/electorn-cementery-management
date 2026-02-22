<template>
    <!-- <img src="../../../img/cementerylayout.jpg" alt=""> -->
     <div class=" h-full w-full bg-amber-200">
        <!-- <h1 class=" text-2xl font-bold text-center py-5">Cementery Map</h1> -->
        <div class=" w-full h-full flex justify-center align-middle items-center ">
            <div class=" flex gap-10">
                <div>
                    <template class=" flex flex-col " v-for="value in source" :key="value">
                    <p class=" text-center py-2 bg-white rounded-md shadow-md w-40 mb-3">{{ value }}</p>
                </template>
                </div>
            
                <div class="flex flex-col gap-10">
                    <div class="flex flex-wrap gap-5">
                        <template class=" " v-for="value in PlotA" :key="value.id">
                            <p class=" text-center py-2 rounded-md shadow-md w-40 mb-3" :class=" value.status === 'Available'? 'bg-green-500' : value.status === 'Reserved'? 'bg-yellow-500' : 'bg-red-500'">{{ value.name }}</p>

                        </template>
                    </div>
                    <div class="flex flex-wrap gap-5">
                        <template class=" " v-for="value in PlotB" :key="value.id">
                            <p class=" text-center py-2 rounded-md shadow-md w-40 mb-3" :class=" value.status === 'Available'? 'bg-green-500' : value.status === 'Reserved'? 'bg-yellow-500' : 'bg-red-500'">{{ value.name }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
     </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { Reservation, ReservationPlotStatus } from '../../../types/Reservation'; // Import your interface
import { ReserveService } from '../../../utils/ReserveService';

// 1. Tell the ref it is an array of Reservations
const reservations = ref<Reservation[]>([]);
let PlotA: Ref<Plot[]> = ref([]);
let PlotB: Ref<Plot[]> = ref([]);
reservations.value = JSON.parse(localStorage.getItem('reservations') || '[]');
loadPlots();
onMounted(async () => {
  reservations.value = await ReserveService.getAllReservations();
  localStorage.setItem('reservations', JSON.stringify(reservations.value));
  console.log(reservations.value);
  PlotA.value = [];
  PlotB.value = [];
  loadPlots();
});
function loadPlots(){
    for (let i = 1; i <= 20; i++) {
    PlotA.value.push({
        id: `PlotA${i}`,
        name: `Plot A${i}`,
        status: getPlotStatus(reservations.value, `plotA${i}`)

    });
    PlotB.value.push({
        id: `PlotB${i}`,
        name: `Plot B${i}`,
        status: getPlotStatus(reservations.value, `plotB${i}`)
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
type Plot = {
    id: string;
    name: string;
    status: 'Reserved' | 'Occupied' | 'Available';
};
const source: Ref<string[]> = ref([
  "Plot 1",
  "Plot 2",
  "Plot 3",
  "Plot 4",
]);


</script>