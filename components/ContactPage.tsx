/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, FormEvent } from 'react';
import { SendIcon } from './icons';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status !== 'idle' || !name || !email || !message) return;

    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setStatus('idle');
      }, 3000); // Reset form status after 3 seconds
    }, 1500);
  };

  const isFormDisabled = status === 'sending' || status === 'success';

  return (
    <main className="w-full max-w-2xl mx-auto flex-grow p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full flex flex-col">
            <header className="p-6 border-b border-slate-700">
                <h2 id="contact-page-title" className="text-2xl font-bold text-white">Contact Us</h2>
            </header>
            <div className="p-8">
            {status === 'success' ? (
                <div className="text-center p-8 bg-green-900/30 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-400">Message Sent!</h3>
                    <p className="text-green-300 mt-2">Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-slate-400 mb-6">Have a question or feedback? Fill out the form below and we'll get in touch.</p>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isFormDisabled}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-700/50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isFormDisabled}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-700/50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            required
                            disabled={isFormDisabled}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-700/50 disabled:cursor-not-allowed transition-colors resize-none"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={isFormDisabled || !name || !email || !message}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
                        >
                            <SendIcon className="w-5 h-5" />
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            )}
            </div>
        </div>
    </main>
  );
};

export default ContactPage;