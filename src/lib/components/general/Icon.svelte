<script lang="ts">
    export let name: string
    export let size: string = ''
    export let rotate: number = 0   // 90, 180, 270
    export let flip: string = ''    // 'horizontal', 'verical', 'both'
    export let animate: string = '' // 'beat', 'beat-fade', 'bounce', 'fade', 'flip', 'shake', 'spin', 'spin-reverse', 'spin-pulse'

    $: _size = size && size !== 'md' ? ` fa-${size}` : ''
    $: _name = ` fa-${name}`
    $: _rotate = rotate ? ` fa-rotate-${rotate}` : ''
    $: _flip = flip ? ` fa-flip-${flip}` : ''
    $: _animate = animate ? ` fa-${animate}` : ''
</script>

<span style={$$restProps.style || ''}>
    <i class={`fa-solid${_name}${_size}${_rotate}${_flip}${_animate}`}/>
</span>