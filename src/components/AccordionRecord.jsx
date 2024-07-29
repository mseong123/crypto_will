import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { UploadInput} from './UploadInput';
import { Record} from './Record';
import { useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

let count = 0;

export function AccordionRecord({encryptionPhrase, response}) {
    console.log(response)

    const fields = response.data.data[0].data.content.fields
    const WillRecords = response.data.data[0].data.content.fields.category.map((category,index)=>{
        if (category === "Will") {
            return <Record encryptionPhrase={encryptionPhrase} key={count++} response={response} fields={fields} index={index}/>
        }
    })
    const AssetRecords = response.data.data[0].data.content.fields.category.map((category,index)=>{
        if (category === "Asset") {
            return <Record encryptionPhrase={encryptionPhrase} key={count++} response={response} fields={fields} index={index}/>
        }
    })
    const VideoRecords = response.data.data[0].data.content.fields.category.map((category,index)=>{
        if (category === "Video") {
            return <Record encryptionPhrase={encryptionPhrase} key={count++} response={response} fields={fields} index={index}/>
        }
    })
    const PersonalRecords = response.data.data[0].data.content.fields.category.map((category,index)=>{
        if (category === "Personal") {
            return <Record encryptionPhrase={encryptionPhrase} key={count++} response={response} fields={fields} index={index}/>
        }
    })
    return (
        <>
             <Tabs
                defaultActiveKey="0"
                id="uncontrolled-tab-example"
                className="mb-3"
                >
                <Tab eventKey="0" title="Will" >
                    {WillRecords.length > 0? WillRecords: <p>No Files uploaded yet for this Category</p>}
                </Tab>
                <Tab eventKey="1" title="Asset">
                    {AssetRecords.length > 0? AssetRecords: <p>No Files uploaded yet for this Category</p>}
                </Tab>
                <Tab eventKey="2" title="Video">
                    {VideoRecords.length > 0? VideoRecords: <p>No Files uploaded yet for this Category</p>}
                </Tab>
                <Tab eventKey="3" title="Documents">
                    {PersonalRecords.length > 0? PersonalRecords: <p>No Files uploaded yet for this Category</p>} 
                </Tab>
            </Tabs>
        </>

    )
}