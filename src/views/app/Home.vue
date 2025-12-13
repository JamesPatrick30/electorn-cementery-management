<template>
    <body class=" h-screen w-full bg-white">

        
        <div class=" flex w-full h-full">
            <nav class=" bg-white h-full w-50 shadow-md p-5">
                <p class=" mb-20 font-bold text-2xl">Cementery <br>Management</p>
                <ul>
                    <li :class="navInput == 'dashboard' ? 'active' : ''" @click="handleNav('dashboard')">Dashboard</li>
                    <li :class="navInput == 'map' ? 'active' : ''" @click="handleNav('map')">Map</li>
                    <li :class="navInput == 'map' ? 'active' : ''" @click="handleLogout">logout</li>
                </ul>
                
            </nav>
            <div class=" bg-gray-50 h-full w-full">
                <header class="w-full h-9 bg-white text-left flex items-center">
                    <p class=" font-medium">Welcome, {{ user }}</p>
                </header>
                <RouterView />
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
    alert('Welcome ' + user);
});
</script>