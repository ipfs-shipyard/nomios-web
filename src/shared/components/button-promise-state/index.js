import React from 'react';
import { PromiseState, usePromiseState, getPromiseState } from 'react-promiseful';

const defaultOptions = {
    thresholdMs: 300,
    onSettleDelayMs: {
        rejected: 2000,
        fulfilled: 1500,
        fulfilledWithinThreshold: 0,
    },
    statusMap: {
        pendingWithinThreshold: 'none',
        fulfilledWithinThreshold: 'none',
        pending: 'loading',
        fulfilled: 'success',
        rejected: 'error',
    },
};

export const ButtonPromiseState = (props) => (
    <PromiseState
        { ...defaultOptions }
        { ...props } />
);

export const useButtonPromiseState = (promise, options) => (
    usePromiseState(promise, {
        ...defaultOptions,
        ...options,
    })
);

export { getPromiseState };
