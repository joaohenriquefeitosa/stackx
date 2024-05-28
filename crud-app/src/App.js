import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = '';

const App = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ itemId: '', info: '' });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const result = await axios.get(api);
        setItems(result.data);
    };

    const createItem = async () => {
        await axios.post(api, form);
        fetchItems();
    };

    const updateItem = async () => {
        await axios.put(api, form);
        fetchItems();
    };

    const deleteItem = async (itemId) => {
        await axios.delete(api, { data: { itemId } });
        fetchItems();
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-5">
            <div className="d-flex align-items-center justify-content-center">
              <div>
                <h1 className="mb-4">CRUD App</h1>
                <div className="mb-3">
                    <input className="form-control" name="itemId" placeholder="Item ID" value={form.itemId} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <input className="form-control" name="info" placeholder="Info" value={form.info} onChange={handleChange} />
                </div>
                <button className="btn btn-primary me-2" onClick={createItem}>Create</button>
                <button className="btn btn-warning me-2" onClick={updateItem}>Update</button>
                <ul className="list-group mt-4">
                    {items.map(item => (
                        <li key={item.itemId} className="list-group-item d-flex justify-content-between align-items-center">
                            {item.itemId}: {item.info}
                            <button className="btn btn-danger" onClick={() => deleteItem(item.itemId)}>Delete</button>
                        </li>
                    ))}
                </ul>
              </div>
            </div>
        </div>
    );
};

export default App;
