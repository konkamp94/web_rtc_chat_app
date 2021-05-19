import { React } from 'react'
import './ConnectionTab.css'
const ConnectionTab = (props) => {
    let name = props.name;
    let selectedTab = props.selectedTab;
    let classes = [];

    classes.push('connection-tab');
    classes.push('name-position');

    if(selectedTab === name) {
        classes.push('selected-tab') 
    } else {
        classes.push('not-selected-tab')
    }

    return (
        <div id={'div-tab-' + name} onClick={(event) => props.onClickTab(event)} className={classes.join(' ')}>
            <span id={'span-tab-' + name} >{name}</span>
        </div>
    )


}

export default ConnectionTab