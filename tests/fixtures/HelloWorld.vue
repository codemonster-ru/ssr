<template>
    <div class="hello">
        <h1>{{ message }}</h1>
    </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>
