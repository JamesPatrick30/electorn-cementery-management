<template>
    <!-- toast -->
    <div class=" bg-red-300 absolute top-5 right-5 p-3 rounded-md shadow-md z-40" v-if="credentialsValid">
        <p>Invalid credentials</p>
    </div>
    <body class=" h-screen w-full bg-gray-300">
        <header class="w-full h-9 bg-white text-left flex items-center px-5 shadow-md">
            <h2 class=" font-bold ">Cementery Management</h2>
        </header>
        <div action="" class=" bg-white p-10 rounded-lg shadow-md w-96 mx-auto mt-20">
            <div class=" flex flex-col justify-center items-center mt-20">
                <h1 class=" text-3xl font-bold mb-10">Login</h1>
                <input v-model="username" type="text" placeholder="Username" class=" mb-5 p-2 rounded-md border border-gray-400 w-80"/>
                <input v-model="password" type="password" placeholder="Password" class=" mb-5 p-2 rounded-md border border-gray-400 w-80"/>
                <button @click="loginUser" class=" bg-blue-500 text-white p-2 rounded-md w-80 hover:bg-blue-600">Login</button>
            </div>
        </div>
    </body>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import type { Ref } from 'vue';
    import { useRouter } from 'vue-router';

    import { AuthService } from '../utils/AuthService'; // Removed because 'login' is not exported
    const router = useRouter();

    const username = ref('');
    const password = ref('');
    const message = ref('');
    const credentialsValid: Ref<boolean> = ref(false);

    function handleLogin() {
        // Simple authentication logic (for demonstration purposes only)
        if (username.value === 'admin' && password.value === 'password') {
            localStorage.setItem('user', username.value);
            router.push({ name : 'dashboard' });
        } else {
            credentialsValid.value = true;
            setTimeout(() => {
                credentialsValid.value = false;
            }, 3000);
            // alert('Invalid credentials');
        }
    };
    const loginUser = async () => {
        try {
            message.value = await AuthService.login(username.value, password.value);
            // alert(message.value);
            localStorage.setItem('user', username.value);

            // console.log(message.value);
             router.push({ name : 'dashboard' });
        } catch (err: any) {
            message.value = err.message || 'Login failed';
            credentialsValid.value = true;
            setTimeout(() => {
                credentialsValid.value = false;
            }, 3000);
            console.log(message.value);

        }
    };
    // Removed loginUser function because 'login' is not exported from AuthService
</script>