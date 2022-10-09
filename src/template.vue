<template>
    <div>

    </div>
</template>

<script type="text/ecmascript-6">

    // import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        props: {
            title: {
                type: String,
            }
        },
        data() {
            return {}
        },
        computed: {
            aa() {
                return "";
            }
        },
        methods: {
            bb() {
            }
        },
        created() {
        },
        mounted() {
        },
        destroyed() {
        },
        activated() {
        },
        deactivated() {
        },
        components: {},
        beforeRouteEnter(to, from, next) {
            next();
        },
        beforeRouteLeave(to, from, next) {
            next();
        },
        watch: {
            '$route'(to, from) {
            }
        }
    }
</script>

<style scoped>
</style>