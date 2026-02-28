<template>
    <body class=" h-screen w-full bg-white">

        
        <div class=" flex w-full h-full">
            <nav class=" bg-white h-full w-50 shadow-md p-5">
                <p class="h-1/5 mb-20 font-bold text-2xl">Cementery <br>Management</p>
                <ul class=" h-3/5 flex flex-col gap-5 text-lg">
                    <li :class="navInput == 'dashboard' ? 'active' : ''" @click="handleNav('dashboard')">Dashboard</li>
                    <li :class="navInput == 'map' ? 'active' : ''" @click="handleNav('map')">Map</li>
                </ul>
                    <p class=" hover:underline cursor-pointer" @click="handleLogout">logout</p>
                
            </nav>
            <div class=" bg-gray-50 h-full w-full">
                <header class="w-full h-1/15 bg-white text-left flex items-center">
                    <p class=" font-medium">Welcome, {{ user }}</p>
                </header>
                <div class=" overflow-auto h-14/15">
                    <RouterView />
                </div>
                
                <!-- Dashboard content goes here -->
            </div>
        </div>
        
    </body>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router';
const router = useRouter();

let navInput: string = ref('dashboard').value;

const user: string | null = localStorage.getItem('user');
if (!user) {
    router.push({ name: 'login' });
}
const handleLogout = () => {
    localStorage.removeItem('user');
    router.push({ name: 'login' });
};
const handleNav = (routeName: string) => {
    router.push({ name: routeName });
    navInput = routeName;
    // alert('Navigated to ' + routeName);
};
onMounted(() => {
    // alert('Welcome ' + user);
});
</script>