import { accessibleRouteChangeHandler, convertBlobToBase64, convertBase64ToBlob, dateConvert, dateConvert2 } from "@app/utils/utils";

describe('accessibleRouteChangeHandler', ()=> {
    it('should not return null', async () => {
        const handler = accessibleRouteChangeHandler();
        expect(handler).not.toBeNull();
    });

    it('no maincontainer', async () => {
        accessibleRouteChangeHandler();
        jest.useFakeTimers();
    });


});


describe('convertBlobToBase64', ()=> {
    it('returns a Promise', () => {
        const base64Image = "data:image/png;base64,VEhJUyBJUyBUSEUgQU5TV0VSCg";
        const blob = convertBase64ToBlob(base64Image);
        const result = convertBlobToBase64(blob);
        expect(result).toBeInstanceOf(Promise);
        expect(convertBlobToBase64(blob)).resolves.toContain(base64Image);
    })
});

describe('convertBase64ToBlob', ()=> {
    it('returns a blob', () => {
        const base64Image = "data:image/png;base64,VEhJUyBJUyBUSEUgQU5TV0VSCg";
        const result = convertBase64ToBlob(base64Image);
        expect(result).toBeInstanceOf(Blob);
    })
});

describe('dateConvert', ()=> {
    it('empty date', async ()=> {
        expect(dateConvert("")).toEqual("");
    });
    it('YYYY-MM-DD', async ()=> {
        expect(dateConvert("2021-09-28")).toEqual("09-28-2021");
    });
    it('MM-DD-YYYY', async ()=> {
        expect(dateConvert("09-28-2021")).toEqual("2021-09-28");
    });  

})

describe('dateConvert2', ()=> {
    it('empty date', async ()=> {
        expect(dateConvert2("")).toEqual("");
    });
    it('YYYY-DD-MM', async ()=> {
        expect(dateConvert2("2021-28-09")).toEqual("09-28-2021");
    });
    it('MM-DD-YYYY', async ()=> {
        expect(dateConvert2("09-28-2021")).toEqual("2021-09-28");
    });  

})
