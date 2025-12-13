<template>
    
    <body class=" h-screen w-full bg-gray-300">
        <header class="w-full h-9 bg-white text-left flex items-center px-5 shadow-md">
            <h2 class=" font-bold ">Cementery Management</h2>
        </header>
        <form action="" class=" bg-white p-10 rounded-lg shadow-md w-96 mx-auto mt-20">
            <div class=" flex flex-col justify-center items-center mt-20">
                <h1 class=" text-3xl font-bold mb-10">Login</h1>
                <input v-model="username" type="text" placeholder="Username" class=" mb-5 p-2 rounded-md border border-gray-400 w-80"/>
                <input v-model="password" type="password" placeholder="Password" class=" mb-5 p-2 rounded-md border border-gray-400 w-80"/>
                <button @click.prevent="handleLogin" class=" bg-blue-500 text-white p-2 rounded-md w-80 hover:bg-blue-600">Login</button>
            </div>
        </form>
    </body>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();

    let username: string = ref('').value;
    let password: string = ref('').value;

    const handleLogin = () => {
        // Simple authentication logic (for demonstration purposes only)
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('user', username);
            router.push({ name : 'dashboard' });
        } else {
            alert('Invalid credentials');
        }
    };
</script>