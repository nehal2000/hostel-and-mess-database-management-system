import React, { useState, useEffect } from 'react';
import { Form, Button, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from "../components/messagecomponent";
import Loader from "../components/loadercomponent";
import FormContainer from "../components/formcontainercomponent";
import { listmessdetails, updatemessdetails } from "../actions/messactions";
import { MESS_UPDATE_RESET } from "../constants/messconstants";

const Editmess = (props) => {
    const messid = props.match.params.id;

    const [date, setdate] = useState('');
    const [day, setday] = useState('');
    const [rationused, setrationused] = useState(25);
    const [foodwasted, setfoodwasted] = useState(12);

    const dispatch = useDispatch();

    const messdetails = useSelector((state) => state.messdetails);
    const { loading, error, mess } = messdetails;

    const updatemess = useSelector((state) => state.updatemess);
    const { loading: loadingupdate, error: errorupdate, success: successupdate } = updatemess;

    useEffect(() => {
        if (successupdate) {
            dispatch({
                type: MESS_UPDATE_RESET
            });
            props.history.push('/mess');
        } else {
            if (!mess.date || mess._id !== messid) {
                dispatch(listmessdetails(messid));
            } else {
                setdate(mess.date);
                setday(mess.day);
                setrationused(mess.rationused);
                setfoodwasted(mess.foodwasted);
            }
        }
    }, [dispatch, messid, mess, props.match, props.history, successupdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatemessdetails({
            _id: messid, date, day, rationused, foodwasted
        }));
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item><Link to="/mess">Mess</Link></Breadcrumb.Item>
                <Breadcrumb.Item ><Link to={`/mess/${mess._id}`}>{mess.date}</Link></Breadcrumb.Item>
                <Breadcrumb.Item href="#" active>Edit</Breadcrumb.Item>
            </Breadcrumb>
            <LinkContainer classname='my-3' to={`/mess/${mess._id}`}><Button variant="dark"><span className="fas fa-chevron-left"></span> Back</Button></LinkContainer>
            {loadingupdate && <Loader />}
            {errorupdate && <Message variant='danger'>{errorupdate.statusText ? `Error ${errorupdate.status}: ${errorupdate.statusText}` : errorupdate}</Message>}
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error.statusText ? `Error ${error.status}: ${error.statusText}` : error}</Message> :
                    <FormContainer>
                        <h1>Edit Mess Details</h1>
                        <br />
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='date'>
                                <Form.Label>Date</Form.Label>
                                <Form.Control type='date' placeholder='Enter Date' value={date} onChange={(e) => setdate((e.target.value).toString())}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='day'>
                                <Form.Label>Day</Form.Label>
                                <Form.Control as='select' value={day} onChange={(e) => setday(e.target.value)}>
                                    {
                                        ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((d) => {
                                            return <option key={d} value={d}>{d}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='rationused'>
                                <Form.Label>Ration Used</Form.Label>
                                <Form.Control type='number' placeholder='Enter Ration Used' value={rationused} onChange={(e) => setrationused(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='foodwasted'>
                                <Form.Label>Food Wasted</Form.Label>
                                <Form.Control type='number' placeholder='Enter Food Wasted' value={foodwasted} onChange={(e) => setfoodwasted(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button type='submit' variant='primary'>Update</Button>
                        </Form>
                    </FormContainer>
            }
        </>
    )
}

export default Editmess;
