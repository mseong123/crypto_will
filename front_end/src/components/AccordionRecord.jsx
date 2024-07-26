import Accordion from 'react-bootstrap/Accordion';
import { UploadInput} from './UploadInput';
import { Record} from './Record';
import { useState } from 'react'

export function AccordionRecord({encryptionPhrase, response}) {
    console.log(response)
    
    return (
        <>
            <h4>Records</h4>
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Will</Accordion.Header>
                    <Accordion.Body>

                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Will"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Asset</Accordion.Header>
                    <Accordion.Body>
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Asset"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Video</Accordion.Header>
                    <Accordion.Body>
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Asset"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Personal Documents</Accordion.Header>
                    <Accordion.Body>
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Asset"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>

    )
}