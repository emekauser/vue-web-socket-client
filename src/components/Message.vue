<template>
  <div class="w-full flex justify-end" style="dis">
    <div class="bg-indigo-600  mx-4 my-2 p-2 rounded-lg chat-box text-sm">
      <strong>{{ data.name }}</strong>
      <p>{{ data.message }}</p>
      <p style="font-size:9px">{{ data.created_at }}</p>
    </div>
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

<style>
.chat-box {
  color: white;
  min-width: 50px;
}
</style>
