import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid';

var ws = new WebSocket('wss://ex0ndlr49f.execute-api.eu-central-1.amazonaws.com/dev')

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
    switch (action.type) {
        case 'increment':
            var newState = state!==pinax.length-1?state+1:state;
            action.url==="/control"&&ws.send(`{"message":"${newState}", "action":"message"}`);
            return newState;
        case 'decrement':
            var newState = state!==0?state-1:state;
            action.url==="/control"&&ws.send(`{"message":"${newState}", "action":"message"}`);
            return newState; 
        case 'set':
            console.log("setted:", action.data)
            var newState = parseInt(action.data);
            if(action.url==="/control") {
                console.log("went in here");
                ws.send(`{"message":"${newState}", "action":"message"}`)
            }
            return newState;
        default:
            throw new Error("This action is not supported.")
    }
}
export default function Gallery() {
    const [ count, dispatch ] = React.useReducer(countReducer, 0);
    const [ connected, setConnected ] = React.useState(false);
    const { url } = useRouteMatch()

    React.useEffect(() => {
        ws.onopen = () => {
            if(url==="/control"){
                dispatch({type:'set', data:'0', url})
            }
        }
        ws.onerror = err => {
            console.log("socket encountered error!");
            ws.close();
        }
        ws.onmessage = evt => {
            if(url!=="/control"){
                ws.onmessage = evt => {
                    if(evt.data==-1){
                        setConnected(false)
                    }else{
                        !connected&&setConnected(true)
                        console.log("got message:",evt.data);
                        dispatch({type:'set', data:evt.data, url})
                    }
                }
            }
        }
        ws.onclose = e => {
            if(connected)
                ws = new WebSocket('wss://ex0ndlr49f.execute-api.eu-central-1.amazonaws.com/dev')
        }
        return () => {
            setConnected(false)
            if(url!=="/control"){
                dispatch({type:'set', data:'-1', url})
            }
            ws.close();
        }
    }, [])
    console.log("Connected:", connected);
    return (
        <div className="wrapper">
            <div className="content">
                {/* Titled contents */}
                {pinax[count].type==="titledContent"&&<>
                    <div className="content-title">
                        <div className="title-card" key={uuidv4()}>
                            <h1>{pinax[count].title}</h1>
                        </div>
                    </div>
                    <div className="content-body" key={uuidv4()}>
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
                        <div className="half-content-body">
                            <div className="untitled-card with-padding" key={uuidv4()}>
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
            <button id="prev-button" onClick={()=>dispatch({type:'decrement', url})} disabled={count===0}><FaAngleLeft /></button>
            <button id="next-button" onClick={()=>dispatch({type:'increment', url})} disabled={count===pinax.length-1}><FaAngleRight /></button>
        </div>
    )
}