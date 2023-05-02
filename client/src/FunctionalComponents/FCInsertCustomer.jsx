
const contractFileInputRef = useRef(null);


const contractButton = () => {
    contractFileInputRef.current.click();
};

<Col>
    <Button onClick={contractButton} className='btn-contract' type="button">עותק חוזה</Button>
    <input
        type="file"
        ref={contractFileInputRef}
        style={{ display: 'none' }}
    />
</Col>