function getElementCoordinates(element, type) {
    var rect = element.getBoundingClientRect();
    if(element.tagName != 'P') { return }
    return {
        label_name: element.tagName == 'div' ? type : element.tagName,
        // element: element,
        bbox_x: rect.left + window.scrollX,
        bbox_width: element.clientWidth,
        bbox_y: rect.top + window.scrollY,
        bbox_height: element.clientHeight,
    };
}

function outlineElementIfSizeDiffers(element) {
    // Get the parent element
    var parent = element.parentNode;
    if(element == document.body) {return false;}
    if(element.offsetHeight == 0 || element.offsetWidth == 0) { return false; }
    // Check if the parent exists, is not the root element, and element has siblings
    if (parent && parent instanceof HTMLElement && (element.previousElementSibling || element.nextElementSibling)) {
        var parentComputedStyle = getComputedStyle(parent);
        var elementComputedStyle = getComputedStyle(element);
        if (
            (element.offsetWidth + parseFloat(elementComputedStyle.marginLeft) + parseFloat(elementComputedStyle.marginRight) === parent.offsetWidth - parseFloat(parentComputedStyle.paddingLeft) - parseFloat(parentComputedStyle.paddingRight) && element.offsetHeight !== parent.offsetHeight) || 
            (parentComputedStyle.display === 'flex' && parentComputedStyle.flexDirection.indexOf('column') >= 0)
        ) {
            element.style.setProperty('outline', '1px dotted blue', 'important');
            return getElementCoordinates(element, 'row');
        } else if (
            (element.offsetHeight + parseFloat(elementComputedStyle.marginTop) + parseFloat(elementComputedStyle.marginBottom) === parent.offsetHeight - parseFloat(parentComputedStyle.paddingTop) - parseFloat(parentComputedStyle.paddingBottom) && element.offsetWidth !== parent.offsetWidth) || 
            (parentComputedStyle.display === 'flex' && parentComputedStyle.flexDirection.indexOf('row') >= 0)
        ) {
            element.style.setProperty('outline', '1px dotted red', 'important');
            return getElementCoordinates(element, 'column');
        } else if (element.offsetHeight !== parent.offsetHeight || element.offsetWidth !== parent.offsetWidth) {
            element.style.setProperty('outline', '1px dotted green', 'important');
            return getElementCoordinates(element, 'column');
        }
    } else {
        element.style.setProperty('outline', '1px dotted green', 'important');
        return getElementCoordinates(element, 'column');
    }
    return null;
}

function traverseAndOutline(element) {
    if (!element) return;

    // TODO: kisi bhi element ki opacity 0 ho to usko nhi lena nahi uske baccho ko


    // Check and outline the current element
    var isOutlined = outlineElementIfSizeDiffers(element);

    if(isOutlined) {
        var data = isOutlined;
        console.log(data);
        if(window.dataset) {
            window.dataset.push(data);
        } else {
            window.dataset = [data];
        }
    }

    // If the element is not outlined, go through its children
    // if (!isOutlined && (element.offsetHeight || element.offsetWidth)) {
        if(element.children && element.children.length > 0) {
            var child = element.children[0];
            traverseAndOutline(child);
        }
    // }
    // Proceed to the next sibling
    if(element.nextElementSibling) {
        traverseAndOutline(element.nextElementSibling);
    }
}

// Start the traversal from the body element
traverseAndOutline(document.body);