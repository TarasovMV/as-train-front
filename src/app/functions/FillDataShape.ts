export function fillDataShape<T>(
    dataShapeObject: T,
    srcDataObject?: Partial<T>,
    excludeFields?: [keyof T] | any[],
    removeUndefinedFields: boolean = true
): T {
    const result: any = Object.assign({}, dataShapeObject);
    const fields: string[] = Object.keys(dataShapeObject);
    // if srcDataObject is empty that mean we want just deep copy dataShapeObject
    if (!srcDataObject) {
        srcDataObject = dataShapeObject;
    }
    // #region define inline function for smart field copy
    // tslint:disable-next-line: typedef
    const smartCopyField = (leftSideObjRef: any, rightSideObjRef: any): any => {
        // check that object is Date
        if (typeof rightSideObjRef === 'object' && rightSideObjRef !== null) {
            // date
            if (rightSideObjRef instanceof Date) {
                return new Date(rightSideObjRef);
            } else {
                // array
                if (rightSideObjRef.constructor === Array) {
                    const newLeftSide: any[] = [];
                    for (const arrItem of rightSideObjRef) {
                        newLeftSide.push(smartCopyField(undefined, arrItem));
                    }
                    return newLeftSide;
                } else {
                    // other objects
                    if (rightSideObjRef.constructor === Object) {
                        // object field, so we fill datashape for that field
                        if (!leftSideObjRef || leftSideObjRef === null) {
                            return fillDataShape<any>(
                                rightSideObjRef,
                                rightSideObjRef,
                                [],
                                removeUndefinedFields
                            );
                        } else {
                            return fillDataShape<any>(
                                leftSideObjRef,
                                rightSideObjRef,
                                [],
                                removeUndefinedFields
                            );
                        }
                    } else {
                        // for any other types, just copy as is
                        return rightSideObjRef;
                    }
                }
            }
        } else {
            // field value is simple type
            return rightSideObjRef;
        }
    };
    // #endregion
    // copy data from srcDataObject to result object
    for (const fieldName of fields) {
        if (excludeFields && excludeFields.includes(fieldName as any)) {
            continue;
        }
        if (srcDataObject.hasOwnProperty(fieldName)) {
            // check that field walue is object or not
            result[fieldName] = smartCopyField(
                result[fieldName],
                (srcDataObject as any)[fieldName]
            );
        } else {
            const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(
                srcDataObject.constructor.prototype,
                fieldName
            );
            if (descriptor && descriptor.get) {
                result[fieldName] = (srcDataObject as any)[fieldName];
            }
        }
    }
    // remove fields with undefined values
    if (removeUndefinedFields) {
        for (const fieldName of fields) {
            if (result[fieldName] === undefined) {
                delete result[fieldName];
            }
        }
    }
    return result;
}