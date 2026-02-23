<template>
    <div class="w-full h-fit mt-11">
        <section class="w-full flex justify-center items-center h-fit" id="cards">
            <div class=" w-[90%] flex justify-between items-center">
                <div class="card bg-[#DEF1FF] flex justify-between items-center shadow-md rounded-lg p-5 w-1/3 mx-2">
                    <h2 class="text-md lg:text-lg font-semibold mb-3">Available <br>
                            Plots</h2>
                    <p class=" text-3xl font-bold text-[#0095FF]">{{ 43 - reservations.length }}</p>
                </div>
                <div class="card bg-[#FAFFAF] flex justify-between items-center shadow-md rounded-lg p-5 w-1/3 mx-2">
                    <h2 class="text-md lg:text-lg font-semibold mb-3">Reserved <br>
                            Plots</h2>
                    <p class=" text-3xl font-bold text-[#899300]">{{ reservations.filter(r => r.plotStatus === 'Reserved').length }}</p>
                </div>
                <div class="card bg-[#D9FFE3] flex justify-between items-center shadow-md rounded-lg p-5 w-1/3 mx-2">
                    <h2 class="text-md lg:text-lg font-semibold mb-3">Occupied <br>
                            </h2>
                    <p class=" text-3xl font-bold text-[#00D83A]">{{ reservations.filter(r => r.plotStatus === 'Occupied').length }}</p>
                </div>
            </div>
        </section>
        <section class="w-full flex justify-center items-center" id="Reservations" role="Reservations">
            <div class="w-[90%] bg-white mt-10 p-5 shadow-md rounded-lg">
                <h2 class=" text-xl font-bold mb-5">Plots</h2>
                <table class=" w-full table-auto  overflow-auto max-h-1 scrollbar-thin scrollbar-thumb-gray-300">
                    <thead>
                        <tr class=" bg-gray-200">
                            <th class=" p-3 text-left">Name</th>
                            <th class=" p-3 text-left">Plot Number</th>
                            <th class=" p-3 text-left">Date Reserved</th>
                            <th class=" p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody class=" overflow-hidden max-h-1 scrollbar-thin scrollbar-thumb-gray-300">
                        <template v-for="reservation in reservations" :key="reservation.plotId">
                            <tr class=" border-b">
                                <td class=" p-3">{{ reservation.username }}</td>
                                <td class=" p-3">{{ reservation.plotId }}</td>
                            <td class=" p-3">{{ reservation.created_at.toDate().toISOString().split('T')[0] }}</td>
                            <td class=" p-3">{{ reservation.plotStatus }}</td>
                            </tr>
                        </template>
                        
                    </tbody>
                </table>

            </div>
        </section>
        <section class="w-full flex justify-center items-center mt-10" role="alert">
            <div class="w-[90%] flex justify-between items-start">
                <div class=" w-[67%] bg-white p-5 shadow-md rounded-lg h-70">
                 
                        <h2 class=" text-xl font-bold mb-5">Alerts & Notifications</h2>
                        <div class=" overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-300 ">
                            <div v-for="(alert, index) in alerts" :key="index" class=" bg-yellow-100 p-3 rounded-md mb-3">
                                <p class=" text-yellow-800">{{ alert }}</p>
                            </div>
                        </div>
                        

                    
                </div>
                <div class=" w-[30%] h-70 bg-white shadow-md rounded-lg  p-5" role="Quick Actions">
                    <h2 class=" text-xl font-bold mb-5">Quick Actions</h2>
                    <div class=" h-[80%] flex flex-col justify-around">
                        <button class="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">Add New Reservation</button>
                        <button class="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300">View All Plots</button>
                        <button class="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300">Generate Report</button>

                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
    // import { onMounted } from 'vue';
    import { ref, onMounted } from 'vue';
    import type { Ref } from 'vue';
    import { ReserveService } from '../../../utils/ReserveService';

    const props = defineProps<{ plotId: string }>();
import type { Reservation } from '../../../types/Reservation'; // Import your interface

// 1. Tell the ref it is an array of Reservations
const reservations = ref<Reservation[]>([]);

onMounted(async () => {
    await ReserveService.checkAndAutoOccupy();
  reservations.value = await ReserveService.getAllReservations();
  console.log(reservations.value);
});

    let alerts: Ref<Array<string>> = ref([
        "System maintenance scheduled for June 15th.",
        "New plot types available for reservation.",
        "Reminder: Update your contact information.",
        "Upcoming holiday closure on July 4th.",
        "New feature: Online payment for reservations now live."
    ]);
</script>