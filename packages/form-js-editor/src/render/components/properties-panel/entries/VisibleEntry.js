import { isUndefined } from 'min-dash';

import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService } from '../../../hooks';
import { useRef, useEffect, useState, useCallback } from 'preact/hooks';

import {TextFieldEntry, isTextFieldEntryEdited, SelectEntry} from '@bpmn-io/properties-panel';


export default function VisibleEntry(props) {
    const {
        editField,
        field
    } = props;

    const {
        type
    } = field;

    const entries = [];



    if (INPUTS.includes(type)) {
        entries.push({
            id: 'visible',
            component: Visible,
            editField: editField,
            field: field,
            isEdited: isTextFieldEntryEdited
        });
    }

    return entries;
}

function Visible(props) {
    const {
        editField,
        field,
        id
    } = props;

    const formFieldRegistry = useService('formFieldRegistry');

    const debounce = useService('debounce');

    const path = [ 'visible' ];
    var initial = false;

    function getFieldId() {
        return document.querySelector('[data-entry-id=visibleExpression]')
    }

    const getValue = () => {
        const value = get(field, path, '')

        let ef = getFieldId()
        if(ef) {
            if (!value || value.length == 0) {
                // @ts-ignore
                ef.style.display = 'none';
            } else {
                // @ts-ignore
                ef.style.display = 'block';
            }
        }

        // console.log('returning value..', value, field, path)
        return value;
    };

    const setValue = (value) => {
        console.log(field, path, value);
        let ef = getFieldId()
        if (!value || value.length == 0) {
            // @ts-ignore
            ef.style.display = 'none';
        } else {
            // @ts-ignore
            ef.style.display = 'block';
        }

        return editField(field, path, value);
    };

    const getOptions = () => {
        setTimeout(() => {
            if(initial === false && getValue() == '') {
                // @ts-ignore
                getFieldId().style.display = 'none'
                initial = true
            }
        })

        const fields = [
            {
                label: 'None',
                value: 'none'
            }
        ]

        formFieldRegistry.getAll().forEach(field => {
            if(field && field.id && field.label && !fields.includes(field)) {
                fields.push(field)
            }
        })

        return fields.map(field => {
            return {
                label: (field.key) ? `${field.label} (${field.key})` : field.label,
                value: field.id
            }
        })
    }

    const validate = (value) => {
        if (isUndefined(value) || !value.length) {
            return 'Must not be empty.';
        }

        if (/\s/.test(value)) {
            return 'Must not contain spaces.';
        }

        const assigned = formFieldRegistry._keys.assigned(value);


        if (assigned && assigned !== field) {
            return 'Must be unique.';
        }

        return null;
    };

    const setExprValue = (value) => {
        return editField(field, ['visibleExpression'], value);
    }

    const getExprValue = () => {
        return get(field, ['visibleExpression'], '')
    }

    const expression = TextFieldEntry({
        debounce,
        // description: 'Maps to a process variable',
        element: field,
        id: 'visibleExpression',
        getValue: getExprValue,
        label: 'Conditional Expression',
        setValue: setExprValue,
        validate: true
        // validate
    })

    return [
        SelectEntry({
            debounce,
            description: 'Determines if a field should be visible',
            element: field,
            getValue,
            id,
            label: 'Visible',
            setValue,
            getOptions,
            validate
        }),
        expression
    ]
}