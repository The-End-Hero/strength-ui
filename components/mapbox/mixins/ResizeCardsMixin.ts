'use strict'
import ReactDOM from 'react-dom'
import $ from 'jquery'

const ResizeCardsMixin = (superclass) => class ResizeCardsMixin extends superclass {
    onMouseDown = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.startMove = true
        this.setState({ dragging: true }, () => {
            $('body').on('mousemove', this.onMouseMove)
            $('body').on('mouseup', this.onMouseUp)
        })
    }

    onMouseMove = (e) => {
        if (!this.startMove) return
        document.body.style.cursor = 'col-resize'
        let { clientX, clientY } = e
        const ref = this.refs.centerRef
        const $center = $(ReactDOM.findDOMNode(ref))
        if (!$center.offset() || !$center.offset().left) {
            return
        }
        let { left } = $center.offset()
        let cwidth = $center.width()
        let width = cwidth + left - clientX
        if (width > cwidth - 36) {
            width = cwidth - 36
        }
        this.setState({ width })
    }

    onMouseUp = (e) => {
        this.startMove = false
        $('body').off('mousemove', this.onMouseMove)
        $('body').off('mouseup', this.onMouseUp)
        this.setState({ dragging: false })
    }

}
export default ResizeCardsMixin
