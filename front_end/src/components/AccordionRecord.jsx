import Accordion from 'react-bootstrap/Accordion';
import { UploadInput} from './UploadInput';
import { Record} from './Record';
import { useState } from 'react'
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
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Will</Accordion.Header>
                    <Accordion.Body>
                        {WillRecords}
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Will"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Asset</Accordion.Header>
                    <Accordion.Body>
                        {AssetRecords}
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Asset"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Video</Accordion.Header>
                    <Accordion.Body>
                        {VideoRecords}
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Video"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Personal Documents</Accordion.Header>
                    <Accordion.Body>
                        {PersonalRecords}
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Personal"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>

    )
}