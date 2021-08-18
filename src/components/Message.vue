<template>
  <div>
    <p>{{ data.name }}</p>
    <p>{{ data.message }}</p>
    <p>{{ data.created_at }}</p>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
