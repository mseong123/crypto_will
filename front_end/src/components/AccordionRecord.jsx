import Accordion from 'react-bootstrap/Accordion';
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
                    <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Will"></UploadInput>
                    {WillRecords}
                </Tab>
                <Tab eventKey="1" title="Asset">
                    <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Asset"></UploadInput>
                    {AssetRecords}
                </Tab>
                <Tab eventKey="2" title="Video">
                    <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Video"></UploadInput>
                    {VideoRecords}
                </Tab>
                <Tab eventKey="3" title="Documents">
                    <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Personal"></UploadInput>
                    {PersonalRecords}
                </Tab>
            </Tabs>
        </>

    )
}