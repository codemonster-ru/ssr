<template>
    <div>{{ message }}</div>
</template>

<script setup>
defineOptions({
    head: {
        title: 'Vue SSR playground',
        meta: [
            { name: 'description', content: 'Description of the page' },
            { property: 'og:title', content: 'Vue SSR playground' },
        ],
    },
});

defineProps({
    message: String,
});
</script>
