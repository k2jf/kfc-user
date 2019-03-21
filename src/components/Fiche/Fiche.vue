<template>
  <div class="fiche border-grey-light border-solid border rounded overflow-hidden">
    <div class="h-10 bg-grey-lighter px-3 font-bold text-sm" style="line-height: 2.5rem">
      {{ title }}
    </div>
    <div class="p-3">
      <slot>
        This is content
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fiche',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
