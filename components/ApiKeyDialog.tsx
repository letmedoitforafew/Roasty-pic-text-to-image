/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-lg w-full p-8 text-center flex flex-col items-center">
        <div className="bg-orange-500/10 p-4 rounded-full mb-6">
          <KeyIcon className="w-12 h-12 text-orange-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">API Key Required for Veo</h2>
        <p className="text-gray-300 mb-6">
          Veo is a paid-only video generation model. To use this feature, please select an API key associated with a Google Cloud project that has billing enabled.
        </p>
        <p className="text-gray-400 mb-8 text-sm">
          For more information, see the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline font-medium"
          >
            how to enable billing
          </a>{' '}
          and{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/pricing#veo-3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline font-medium"
          >
            Veo pricing
          </a>.
        </p>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Continue to Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyDialog;
