<template>
  <div class="fiche border-grey-light border-solid border rounded">
    <div class="h-10 bg-blue-lightest px-3 font-bold text-sm relative" style="line-height: 2.5rem">
      {{ title }}
      <aside>
        <slot name="extra">
        </slot>
      </aside>
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
<style lang="less" scoped>
  aside {
    width: calc(~'100% - 200px');
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
</style>
