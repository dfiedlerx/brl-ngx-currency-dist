import { InputService } from './input.service';
export class InputHandler {
    constructor(htmlInputElement, options) {
        this.inputService = new InputService(htmlInputElement, options);
    }
    handleCut() {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 0);
    }
    handleInput() {
        const rawValue = this.inputService.rawValue ?? '';
        const selectionStart = this.inputService.inputSelection.selectionStart;
        const keyCode = rawValue.charCodeAt(selectionStart - 1);
        const rawValueLength = rawValue.length;
        const storedRawValueLength = this.inputService.storedRawValue.length;
        if (Math.abs(rawValueLength - storedRawValueLength) != 1) {
            this.inputService.updateFieldValue(selectionStart);
            this.onModelChange(this.inputService.value);
            return;
        }
        // Restore the old value.
        this.inputService.rawValue = this.inputService.storedRawValue;
        if (rawValueLength < storedRawValueLength) {
            // Chrome Android seems to move the cursor in response to a backspace AFTER processing the
            // input event, so we need to wrap this in a timeout.
            this.timer(() => {
                // Move the cursor to just after the deleted value.
                this.inputService.updateFieldValue(selectionStart + 1);
                // Then backspace it.
                this.inputService.removeNumber(8);
                this.onModelChange(this.inputService.value);
            }, 0);
        }
        if (rawValueLength > storedRawValueLength) {
            // Move the cursor to just before the new value.
            this.inputService.updateFieldValue(selectionStart - 1);
            // Process the character like a keypress.
            this._handleKeypressImpl(keyCode);
        }
    }
    handleKeydown(event) {
        const keyCode = event.which || event.charCode || event.keyCode;
        if (keyCode == 8 || keyCode == 46 || keyCode == 63272) {
            event.preventDefault();
            if (this.inputService.inputSelection.selectionStart <=
                this.inputService.prefixLength() &&
                this.inputService.inputSelection.selectionEnd >=
                    (this.inputService.rawValue?.length ?? 0) -
                        this.inputService.suffixLength()) {
                this.clearValue();
            }
            else {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
        }
    }
    clearValue() {
        this.setValue(this.inputService.isNullable() ? null : 0);
        this.onModelChange(this.inputService.value);
    }
    handleKeypress(event) {
        const keyCode = event.which || event.charCode || event.keyCode;
        event.preventDefault();
        if (keyCode === 97 && event.ctrlKey) {
            return;
        }
        this._handleKeypressImpl(keyCode);
    }
    _handleKeypressImpl(keyCode) {
        switch (keyCode) {
            case undefined:
            case 9:
            case 13:
                return;
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (this.inputService.canInputMoreNumbers) {
                    const selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd -
                        this.inputService.inputSelection.selectionStart);
                    if (selectionRangeLength == (this.inputService.rawValue?.length ?? 0)) {
                        this.setValue(null);
                    }
                    this.inputService.addNumber(keyCode);
                }
                break;
        }
        this.onModelChange(this.inputService.value);
    }
    handlePaste() {
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 1);
    }
    updateOptions(options) {
        this.inputService.updateOptions(options);
    }
    getOnModelChange() {
        return this.onModelChange;
    }
    setOnModelChange(callbackFunction) {
        this.onModelChange = callbackFunction;
    }
    getOnModelTouched() {
        return this.onModelTouched;
    }
    setOnModelTouched(callbackFunction) {
        this.onModelTouched = callbackFunction;
    }
    setValue(value) {
        this.inputService.value = value;
    }
    /**
     * Passthrough to setTimeout that can be stubbed out in tests.
     */
    timer(callback, delayMilliseconds) {
        setTimeout(callback, delayMilliseconds);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jdXJyZW5jeS9zcmMvbGliL2lucHV0LmhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE1BQU0sT0FBTyxZQUFZO0lBS3ZCLFlBQVksZ0JBQWtDLEVBQUUsT0FBMEI7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsU0FBUztRQUNQLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNsRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7UUFDdkUsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUN2QyxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUVyRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxH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SyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUEwQjtRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxnQkFBZ0Q7UUFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztJQUN4QyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxnQkFBNEI7UUFDNUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQztJQUN6QyxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQW9CO1FBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsUUFBb0IsRUFBRSxpQkFBeUI7UUFDbkQsVUFBVSxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0U2VydmljZSB9IGZyb20gJy4vaW5wdXQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hDdXJyZW5jeUNvbmZpZyB9IGZyb20gJy4vbmd4LWN1cnJlbmN5LmNvbmZpZyc7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dEhhbmRsZXIge1xuICBpbnB1dFNlcnZpY2U6IElucHV0U2VydmljZTtcbiAgb25Nb2RlbENoYW5nZSE6ICh2YWx1ZTogbnVtYmVyIHwgbnVsbCkgPT4gdm9pZDtcbiAgb25Nb2RlbFRvdWNoZWQhOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKGh0bWxJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIG9wdGlvbnM6IE5neEN1cnJlbmN5Q29uZmlnKSB7XG4gICAgdGhpcy5pbnB1dFNlcnZpY2UgPSBuZXcgSW5wdXRTZXJ2aWNlKGh0bWxJbnB1dEVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgaGFuZGxlQ3V0KCk6IHZvaWQge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZSgpO1xuICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgaGFuZGxlSW5wdXQoKTogdm9pZCB7XG4gICAgY29uc3QgcmF3VmFsdWUgPSB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZSA/PyAnJztcbiAgICBjb25zdCBzZWxlY3Rpb25TdGFydCA9IHRoaXMuaW5wdXRTZXJ2aWNlLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0O1xuICAgIGNvbnN0IGtleUNvZGUgPSByYXdWYWx1ZS5jaGFyQ29kZUF0KHNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgY29uc3QgcmF3VmFsdWVMZW5ndGggPSByYXdWYWx1ZS5sZW5ndGg7XG4gICAgY29uc3Qgc3RvcmVkUmF3VmFsdWVMZW5ndGggPSB0aGlzLmlucHV0U2VydmljZS5zdG9yZWRSYXdWYWx1ZS5sZW5ndGg7XG5cbiAgICBpZiAoTWF0aC5hYnMocmF3VmFsdWVMZW5ndGggLSBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkgIT0gMSkge1xuICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCk7XG4gICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlc3RvcmUgdGhlIG9sZCB2YWx1ZS5cbiAgICB0aGlzLmlucHV0U2VydmljZS5yYXdWYWx1ZSA9IHRoaXMuaW5wdXRTZXJ2aWNlLnN0b3JlZFJhd1ZhbHVlO1xuXG4gICAgaWYgKHJhd1ZhbHVlTGVuZ3RoIDwgc3RvcmVkUmF3VmFsdWVMZW5ndGgpIHtcbiAgICAgIC8vIENocm9tZSBBbmRyb2lkIHNlZW1zIHRvIG1vdmUgdGhlIGN1cnNvciBpbiByZXNwb25zZSB0byBhIGJhY2tzcGFjZSBBRlRFUiBwcm9jZXNzaW5nIHRoZVxuICAgICAgLy8gaW5wdXQgZXZlbnQsIHNvIHdlIG5lZWQgdG8gd3JhcCB0aGlzIGluIGEgdGltZW91dC5cbiAgICAgIHRoaXMudGltZXIoKCkgPT4ge1xuICAgICAgICAvLyBNb3ZlIHRoZSBjdXJzb3IgdG8ganVzdCBhZnRlciB0aGUgZGVsZXRlZCB2YWx1ZS5cbiAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCArIDEpO1xuXG4gICAgICAgIC8vIFRoZW4gYmFja3NwYWNlIGl0LlxuICAgICAgICB0aGlzLmlucHV0U2VydmljZS5yZW1vdmVOdW1iZXIoOCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBpZiAocmF3VmFsdWVMZW5ndGggPiBzdG9yZWRSYXdWYWx1ZUxlbmd0aCkge1xuICAgICAgLy8gTW92ZSB0aGUgY3Vyc29yIHRvIGp1c3QgYmVmb3JlIHRoZSBuZXcgdmFsdWUuXG4gICAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0IC0gMSk7XG5cbiAgICAgIC8vIFByb2Nlc3MgdGhlIGNoYXJhY3RlciBsaWtlIGEga2V5cHJlc3MuXG4gICAgICB0aGlzLl9oYW5kbGVLZXlwcmVzc0ltcGwoa2V5Q29kZSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC53aGljaCB8fCBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuICAgIGlmIChrZXlDb2RlID09IDggfHwga2V5Q29kZSA9PSA0NiB8fCBrZXlDb2RlID09IDYzMjcyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0IDw9XG4gICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UucHJlZml4TGVuZ3RoKCkgJiZcbiAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kID49XG4gICAgICAgICAgKHRoaXMuaW5wdXRTZXJ2aWNlLnJhd1ZhbHVlPy5sZW5ndGggPz8gMCkgLVxuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2Uuc3VmZml4TGVuZ3RoKClcbiAgICAgICkge1xuICAgICAgICB0aGlzLmNsZWFyVmFsdWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLnJlbW92ZU51bWJlcihrZXlDb2RlKTtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhclZhbHVlKCkge1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy5pbnB1dFNlcnZpY2UuaXNOdWxsYWJsZSgpID8gbnVsbCA6IDApO1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVLZXlwcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC53aGljaCB8fCBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGtleUNvZGUgPT09IDk3ICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVLZXlwcmVzc0ltcGwoa2V5Q29kZSk7XG4gIH1cblxuICBwcml2YXRlIF9oYW5kbGVLZXlwcmVzc0ltcGwoa2V5Q29kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgIGNhc2UgOTpcbiAgICAgIGNhc2UgMTM6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgNDM6XG4gICAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLmNoYW5nZVRvUG9zaXRpdmUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ1OlxuICAgICAgICB0aGlzLmlucHV0U2VydmljZS5jaGFuZ2VUb05lZ2F0aXZlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRTZXJ2aWNlLmNhbklucHV0TW9yZU51bWJlcnMpIHtcbiAgICAgICAgICBjb25zdCBzZWxlY3Rpb25SYW5nZUxlbmd0aCA9IE1hdGguYWJzKFxuICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kIC1cbiAgICAgICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnRcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2VsZWN0aW9uUmFuZ2VMZW5ndGggPT0gKHRoaXMuaW5wdXRTZXJ2aWNlLnJhd1ZhbHVlPy5sZW5ndGggPz8gMClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUobnVsbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbnB1dFNlcnZpY2UuYWRkTnVtYmVyKGtleUNvZGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmlucHV0U2VydmljZS52YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVQYXN0ZSgpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaW5wdXRTZXJ2aWNlLnVwZGF0ZUZpZWxkVmFsdWUoKTtcbiAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5pbnB1dFNlcnZpY2UudmFsdWUpO1xuICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuaW5wdXRTZXJ2aWNlLnZhbHVlKTtcbiAgICB9LCAxKTtcbiAgfVxuXG4gIHVwZGF0ZU9wdGlvbnMob3B0aW9uczogTmd4Q3VycmVuY3lDb25maWcpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0U2VydmljZS51cGRhdGVPcHRpb25zKG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0T25Nb2RlbENoYW5nZSgpOiAodmFsdWU6IG51bWJlciB8IG51bGwpID0+IHZvaWQge1xuICAgIHJldHVybiB0aGlzLm9uTW9kZWxDaGFuZ2U7XG4gIH1cblxuICBzZXRPbk1vZGVsQ2hhbmdlKGNhbGxiYWNrRnVuY3Rpb246ICh2YWx1ZTogbnVtYmVyIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGNhbGxiYWNrRnVuY3Rpb247XG4gIH1cblxuICBnZXRPbk1vZGVsVG91Y2hlZCgpOiAoKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5vbk1vZGVsVG91Y2hlZDtcbiAgfVxuXG4gIHNldE9uTW9kZWxUb3VjaGVkKGNhbGxiYWNrRnVuY3Rpb246ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gY2FsbGJhY2tGdW5jdGlvbjtcbiAgfVxuXG4gIHNldFZhbHVlKHZhbHVlOiBudW1iZXIgfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFNlcnZpY2UudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzdGhyb3VnaCB0byBzZXRUaW1lb3V0IHRoYXQgY2FuIGJlIHN0dWJiZWQgb3V0IGluIHRlc3RzLlxuICAgKi9cbiAgdGltZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQsIGRlbGF5TWlsbGlzZWNvbmRzOiBudW1iZXIpIHtcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkZWxheU1pbGxpc2Vjb25kcyk7XG4gIH1cbn1cbiJdfQ==