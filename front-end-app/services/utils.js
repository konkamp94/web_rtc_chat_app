function sanitize(content) {
    return content
}

function createElement(parentId, childTagName, content, childId = null, className = null) {
    console.log(childTagName)
    let parent = document.getElementById(parentId)
    console.log(parent)
    let child = document.createElement(childTagName)
    child.className = className ? className : ''
    child.setAttribute("id", childId ? childId : '');
    child.appendChild(document.createTextNode(content));
    parent.appendChild(child);
}