import React, { useState } from "react";
import logo from "./genco-logo.png";

export default function App() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        trashDays: [],
        bins: 1,
        addons: [],
        plan: 'weekly'
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const trashOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const addonOptions = ['Recycling Pickup', 'Trash Pickup'];

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const toggleArrayField = (field, value) => {
        setForm(prev => {
            const newValues = prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value];
            return { ...prev, [field]: newValues };
        });
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateEmail = email => /^\S+@\S+\.\S+$/.test(email);
    const validatePhone = phone => /^\d{10}$/.test(phone.replace(/[^\d]/g, ''));

    const validateStep = () => {
        let valid = true;
        const newErrors = {};
        if (step === 1) {
            if (!form.name) {
                newErrors.name = 'This field is required';
                valid = false;
            }
            if (!form.email) {
                newErrors.email = 'This field is required';
                valid = false;
            } else if (!validateEmail(form.email)) {
                newErrors.email = 'Enter a valid email address';
                valid = false;
            }
            if (!form.phone) {
                newErrors.phone = 'This field is required';
                valid = false;
            } else if (!validatePhone(form.phone)) {
                newErrors.phone = 'Enter a 10-digit phone number';
                valid = false;
            }
            if (!form.address) {
                newErrors.address = 'This field is required';
                valid = false;
            }
        }
        if (step === 2 && form.trashDays.length === 0) {
            newErrors.trashDays = 'Select at least one day';
            valid = false;
        }
        if (step === 3 && form.bins <= 0) {
            newErrors.bins = 'Must be at least 1 bin';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const submitForm = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Signup failed');
            }
        } catch (err) {
            alert('Error submitting form');
        }
    };

    if (submitted) {
        return (
            <div style={{ padding: 24, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                <img src={logo} alt="Genco Can Co logo" style={{ height: 80, marginBottom: 20 }} />
                <h1 style={{ color: '#006633' }}>Thank You!</h1>
                <p>Your request has been received. We'll be in touch soon to confirm your trash pickup service.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 700, margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img src={logo} alt="Genco Can Co logo" style={{ height: 80 }} />
                <h1 style={{ color: '#006633', marginTop: 10 }}>Trash Pickup Signup</h1>
            </div>

            {step === 1 && (
                <div>
                    <h2>Basic Info</h2>
                    <input placeholder="Name" value={form.name} onChange={e => handleChange('name', e.target.value)} style={{ width: '100%', margin: '5px 0', borderColor: errors.name ? 'red' : '' }} /><br />
                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}<br />
                    <input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} style={{ width: '100%', margin: '5px 0', borderColor: errors.email ? 'red' : '' }} /><br />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}<br />
                    <input placeholder="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} style={{ width: '100%', margin: '5px 0', borderColor: errors.phone ? 'red' : '' }} /><br />
                    {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}<br />
                    <input placeholder="Address" value={form.address} onChange={e => handleChange('address', e.target.value)} style={{ width: '100%', margin: '5px 0', borderColor: errors.address ? 'red' : '' }} /><br />
                    {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}<br />
                    <select value={form.plan} onChange={e => handleChange('plan', e.target.value)} style={{ width: '100%', margin: '10px 0' }}>
                        <option value="weekly">Weekly ($100/month)</option>
                        <option value="biweekly">Biweekly ($50/month)</option>
                        <option value="vacation">Vacation Rental ($100/month)</option>
                    </select>
                    <p style={{ fontSize: '0.9em', color: '#666' }}><em>All plans are billed monthly (4 weeks at a time).</em></p>
                </div>
            )}

            {/* Other steps remain unchanged */}

            {step === 2 && (
                <div>
                    <h2>Select Trash Days</h2>
                    {trashOptions.map(day => (
                        <label key={day} style={{ display: 'block', margin: '4px 0' }}>
                            <input
                                type="checkbox"
                                checked={form.trashDays.includes(day)}
                                onChange={() => toggleArrayField('trashDays', day)}
                            />
                            {` ${day}`}
                        </label>
                    ))}
                    {errors.trashDays && <span style={{ color: 'red' }}>{errors.trashDays}</span>}
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2>Bins & Add-ons</h2>
                    <input
                        type="number"
                        value={form.bins}
                        onChange={e => handleChange('bins', parseInt(e.target.value))}
                        style={{ width: '100%', margin: '5px 0', borderColor: errors.bins ? 'red' : '' }}
                        min="1"
                    /><br />
                    {errors.bins && <span style={{ color: 'red' }}>{errors.bins}</span>}<br />
                    {addonOptions.map(addon => (
                        <label key={addon} style={{ display: 'block', margin: '4px 0' }}>
                            <input
                                type="checkbox"
                                checked={form.addons.includes(addon)}
                                onChange={() => toggleArrayField('addons', addon)}
                            />
                            {` ${addon}`}
                        </label>
                    ))}
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2>Review</h2>
                    <p><strong>Name:</strong> {form.name}</p>
                    <p><strong>Email:</strong> {form.email}</p>
                    <p><strong>Phone:</strong> {form.phone}</p>
                    <p><strong>Address:</strong> {form.address}</p>
                    <p><strong>Service Plan:</strong> {form.plan}</p>
                    <p><strong>Trash Days:</strong> {form.trashDays.join(', ')}</p>
                    <p><strong>Bins:</strong> {form.bins}</p>
                    <p><strong>Add-ons:</strong> {form.addons.length ? form.addons.join(', ') : 'None'}</p>
                    <button onClick={submitForm} style={{ marginTop: 10, backgroundColor: '#006633', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 5 }}>Submit & Checkout</button>
                </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                {step > 1 && <button onClick={() => setStep(step - 1)} style={{ padding: '8px 16px' }}>Back</button>}
                {step < 4 && <button onClick={handleNext} style={{ padding: '8px 16px', backgroundColor: '#006633', color: '#fff', border: 'none', borderRadius: 5 }}>Next</button>}
            </div>
        </div>
    );
}
