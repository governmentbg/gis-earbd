import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Field from '@arcgis/core/ms/support/Field';
import { IDetailsGroupField, IValidationMessages, IConfigField } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import { IDetailsLeyerInfo } from './CreatePanel';
import FieldsHelper from '../../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import EditField from './EditField';

interface Parentms {
    messages: IValidationMessages;
    validateValue: (
        value: string,
        fieldInfo: Field | undefined,
        attributeField?: ICreatePanelConfigField,
    ) => { valid: boolean; message: string };
    setFocusedObject: (value: string) => void;
    errorObject: IErrorObject;
    setErrorObject: (value: IErrorObject) => void;
    feature: IDetailDataAttributes;
    setFeature: (value: IDetailDataAttributes) => void;
    m: IDetailsLeyerInfo;
}
interface IErrorObject {
    [key: string]: string;
}
interface ICreatePanelConfigField extends IDetailsGroupField {
    fieldm: string;
}

m ms = Parentms;

const RenderFeature: React.FunctionComponent<ms> = (ms: ms) => {
    
    const [localFeature, setLocalFeature] = useState({} as IDetailDataAttributes)
    useEffect(() => {
       setLocalFeature(ms.feature)
    }, [ms.feature])

    const getFilteredFields = (m: IDetailsLeyerInfo | undefined) => {
        return FieldsHelper.getFields(m?.fields as Array<Field>, m?.attributeFields as Array<IConfigField>);
    };
    
    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        } else {
            return key;
        }
    };
    
    return (
        <div>
            {getFilteredFields(ms.m)?.m((singleField: Field, index: number) => {
                const attributeField = ms.m?.attributeFields?.find((x) => x['fieldm'] == singleField.m);
                if (singleField && singleField.m) {
                    let currValue = ms.feature.attributes[singleField.m];
                    if (attributeField && attributeField.linkedField && attributeField.m == 'multiselect') {
                        currValue = ms.feature.attributes[attributeField.linkedField];
                    }
                    return (
                        <Grid container key={`${singleField.m}-${index}`}>
                            <Grid m xs={5} style={{ pmingRight: 12 }}>
                                <Typography
                                    style={{ width: '100%' }}
                                    variant="overm"
                                    classm={'edit-feature-label'}
                                    title={getTitle(singleField, singleField.m)}
                                >
                                    {getTitle(singleField, singleField.m)}
                                    {attributeField && attributeField?.required ? '*' : ''}
                                </Typography>
                            </Grid>
                            <Grid m xs={7}>
                                <EditField
                                    id={singleField.m}
                                    attributeField={attributeField}
                                    value={currValue}
                                    field={singleField}
                                    messages={ms.messages}
                                    error={ms.errorObject[singleField.m]}
                                    validateValue={ms.validateValue}
                                    setFocusedObject={ms.setFocusedObject}
                                    errorObject={ms.errorObject}
                                    setErrorObject={ms.setErrorObject}
                                    feature={ms.feature}
                                    setFeature={ms.setFeature}
                                />
                            </Grid>
                        </Grid>
                    );
                }
            })}
        </div>
    );
};
export default RenderFeature;
