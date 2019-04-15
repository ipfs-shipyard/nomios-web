export const injectPropsIntoStepArray = (steps, stepId, props) => {
    const stepIndex = steps.findIndex((step) => step.props.id === stepId);

    const newProps = { ...steps[stepIndex].props, ...props };
    const newStep = { ...steps[stepIndex] };
    const newSteps = [...steps];

    newStep.props = newProps;
    newSteps[stepIndex] = newStep;

    return newSteps;
};
