<script lang="ts">
    export let type: string = 'solid'
    export let name: string
    export let size: string = ''
    export let rotate: number = 0   // 90, 180, 270
    export let flip: string = ''    // 'horizontal', 'verical', 'both'
    export let animate: string = '' // 'beat', 'beat-fade', 'bounce', 'fade', 'flip', 'shake', 'spin', 'spin-reverse', 'spin-pulse'
    export let append: string = ''  // 'left', 'L' or 'right', 'R', to add some default margin
    export let margin: string = '0.5rem'

    $: _size = size && size !== 'md' ? ` fa-${size}` : ''
    $: _type = ` fa-${type}`
    $: _name = ` fa-${name}`
    $: _rotate = rotate ? ` fa-rotate-${rotate}` : ''
    $: _flip = flip ? ` fa-flip-${flip}` : ''
    $: _animate = animate ? ` fa-${animate}` : ''
    
    $: _append = ['left', 'L', 'start'].includes(append)
    ? ` margin-right: ${margin};` 
    : ['right', 'R', 'end'].includes(append)
    ? ` margin-left: ${margin};`
    : ''
</script>

<span style={`${$$restProps.style || ''}${_append}`}>
    <i class={`${_type}${_name}${_size}${_rotate}${_flip}${_animate}`}/>
</span>