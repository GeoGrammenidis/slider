import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

const ws = new WebSocket('wss://ex0ndlr49f.execute-api.eu-central-1.amazonaws.com/dev')

const pinax = [
    {
        id:0,
        type: "titledContent",
        title: "George Grammenidis",
        content: {
            list: [
                {id:0, item:"Degree: Computer Engineering"},
                {id:1, item:"English level: C1"},
                {id:2, item:"Driver license: B"},
                {id:3, item:"Military obligations: Fulfilled"}
            ]
        }
    },
    {
        id:1,
        type: "titledContent",
        title: "Foundations",
        content: {
            table: {
                list1: [
                    {id:0, item:"C"},
                    {id:1, item:"C++"},
                    {id:2, item:"Java"},
                    {id:3, item:"Data Structures"}
                ],
                list2: [
                    {id:0, item:"Databases"},
                    {id:1, item:"Algorithms"},
                    {id:2, item:"Operating Systems"},
                    {id:3, item:"Web Developing"}
                ]
            }
        }
    },
    {
        id:2,
        type: "titledContent",
        title: "Also familiar with",
        content: {
            list: [
                {id:0, item:"Photoshop / Illustrator"},
                {id:1, item:"Technical Support"},
                {id:2, item:"Electronic Circuits"},
                {id:3, item:"Microcontrollers"}
            ]
        }
    },
    {
        id:3,
        type: "doubleContent",
        content:[
            {
                id:0,
                title:"Thesis",
                list: [
                    {id:0, item:"Database interface", comment:"Bootstrap / php / MySQL"},
                    {id:1, item:"Articles website", comment:"ejs / node.js / MySQL"},
                    {id:2, item:"Articles website", comment:"Angular / node.js / MySQL"},
                ]
            },
            {
                id:1,
                title:"Websites",
                list: [
                    {id:0, item:"E-shop", comment:"magento2"},
                    {id:1, item:"Gallery", comment:"angular / node.js / MySQL"},
                ]
            }
        ]
    },
    {
        id:4,
        type: "doubleContent",
        content:[
            {
                id:0,
                title:"Projects",
                list: [
                    {id:0, item:"Tour of Heroes", comment:"angular documentation"},
                    {id:1, item:"Dating app API", comment:"typescript API / knex / postgreSQL"},
                    {id:2, item:"Refactor Spacex", comment:"angular"},
                    {id:3, item:"Hacker news", comment:"React"},
                    {id:4, item:"Refactor Hacker news with hooks", comment:"React"},
                    {id:5, item:"React hook project", comment:"React"}
                ]
            },
            {
                id:1,
                title:"Others",
                list: [
                    {id:0, item:"Javascript challenges"},
                    {id:1, item:"Courses / Tutorials"},
                ]
            }
        ]
    },
    {
        id:5,
        type: "titledContent",
        title: "Soft Skills",
        content: {
            table: {
                list1: [
                    {id:0, item:"Critical Thinking"},
                    {id:1, item:"Creativity"},
                    {id:2, item:"Problem-solving"},
                    {id:3, item:"Fast learning"}
                ],
                list2: [
                    {id:0, item:"Passionate"},
                    {id:1, item:"Cooperative"},
                    {id:2, item:"Patient"},
                    {id:3, item:"Confident"}
                ]
            }
        }
    },
    {
        id:6,
        type: "titledContent",
        title: "Career Goals",
        content:
        {
            title: "Short-term",
            list: [
                {id:0, item:"Acquire work experience"},
                {id:1, item:"Work in a friendly environment"},
                {id:2, item:"Work on challenging tasks"},
                {id:3, item:"Practise on what I have learned until now"},
                {id:4, item:"Find new things to learn"}
            ]
        }
    },
    {
        id:7,
        type: "titledOnly",
        title: "Thank you for your time!"
    }]

function countReducer (state, action) {
    let next_button = document.getElementById("next-button");
    let prev_button = document.getElementById("prev-button");
    var newState;

    next_button.classList.remove("slider_button_disabled");
    prev_button.classList.remove("slider_button_disabled");
    next_button.classList.add("slider_button");
    prev_button.classList.add("slider_button");

    switch (action.type) {
        case 'increment':
            newState = state!==pinax.length-1?state+1:state;
            action.url==="/control"&&ws.send(`{"message":"${newState}", "action":"message"}`);
            if(newState === pinax.length - 1){
                next_button.classList.add("slider_button_disabled");
                next_button.classList.remove("slider_button");
            }
            break;
        case 'decrement':
            newState = state!==0?state-1:state;
            action.url==="/control"&&ws.send(`{"message":"${newState}", "action":"message"}`);
            if(newState === 0){
                prev_button.classList.add("slider_button_disabled");
                prev_button.classList.remove("slider_button");
            }
            break;
        case 'set':
            console.log("setted:", action.data)
            newState = parseInt(action.data);
            break;
        default:
            throw new Error("This action is not supported.")
    }
    
    return newState;
}

export default function Gallery() {
    const [count, dispatch] = React.useReducer(countReducer, 0)
    const { url } = useRouteMatch()

    React.useEffect(() => {
        ws.onopen = () => {
            if(url==="/control"){
                ws.send('{"message":"0","action":"message"}');
            }
        }
        ws.onerror = err => {
            console.log("socket encountered error!");
        }
        ws.onmessage = evt => {
            if(url!=="/control"){
                ws.onmessage = evt => {
                    console.log("got message:",evt.data);
                    dispatch({type:'set', data:evt.data})
                }
            }
        }
/*         if(url!=="/control"){
            console.log("went here")
            ws.onmessage = evt => {
                console.log("got message")
                dispatch({type:'set', data:evt.data})
            }
        } */
        return () => {}
    }, [])

    return (
        <div id="wrapper">
            <div id="content_wrapper">
                {/* Titled contents */}
                {pinax[count].type==="titledContent"&&<>
                    <div className="content-title">
                        <div className="title-card">
                            <h1>{pinax[count].title}</h1>
                        </div>
                    </div>
                    <div className="content-body">
                        <div className="card with-padding" >
                            {pinax[count].content.title&&
                                <h3>
                                    {pinax[count].content.title}
                                </h3>
                            }
                            {pinax[count].content.list&&
                                <ul>
                                    {pinax[count].content.list.map(x=><li key={x.id}>{x.item}</li>)}
                                </ul>
                            }
                            {pinax[count].content.table&&
                                <div className="flex-container">
                                    <ul className="flex-item">
                                        {pinax[count].content.table.list1.map(x=><li key={x.id}>{x.item}</li>)}
                                    </ul>
                                    <ul className="flex-item">
                                        {pinax[count].content.table.list2.map(x=><li key={x.id}>{x.item}</li>)}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </>}
                {/* Double contents */}
                {pinax[count].type==="doubleContent"&&<>
                    {pinax[count].content.map(cont=>  
                        <div className="half-content-body" key={cont.id}>
                            <div className="untitled-card with-padding">
                                <h2>{cont.title}</h2>
                                <ul>
                                    {cont.list.map(x=>
                                        <li key={x.id}>
                                            {x.item} {x.comment&&<span className="comment">- {x.comment}</span>}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                </>}
                {/* Single title */}
                {pinax[count].type==="titledOnly"&&
                    <div className="full-content-body">
                        <div className="title-card"><h2>{pinax[count].title}</h2></div>
                    </div>
                }
            </div>
            <div id="change"></div>
            <button id="prev-button" className="slider_button" onClick={()=>dispatch({type:'decrement', url})} disabled={count===0}><FaAngleLeft /></button>
            <button id="next-button" className="slider_button" onClick={()=>dispatch({type:'increment', url})} disabled={count===pinax.length-1}><FaAngleRight /></button>
        </div>
    )
}