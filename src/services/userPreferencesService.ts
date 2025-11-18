import { CancelTokenSource } from "axios";
import { UserPreferences } from "../models/userPreferences";
import { BaseService } from "./BaseService";

export class UserPreferencesService extends BaseService<UserPreferences> {
    constructor(errorHandler: any) {
        super("UserPreferences", "UserPreferences", errorHandler);
    }

    addUserPreferences(preferences: UserPreferences, axiosCancel?: CancelTokenSource) {
        return this.postItemBySubURL(preferences, 'AddUserPreferences', false, false, axiosCancel);
    }

    getUserPreferences(userId: number, gridName: string, axiosCancel?: CancelTokenSource) {
        return this.getItems(axiosCancel, `GetUserPreferences/${userId}/${gridName}`);
    }

    deleteUserPreferences(id: number, axiosCancel?: CancelTokenSource) {
        return this.delete(id);
    }

    getUserPreferencesByUserId(userId: number, axiosCancel?: CancelTokenSource) {
        return this.getItemsBySubURL(`UserPreferencesByUserId/${userId}`, axiosCancel);
    }

    updateUserPreferences(preferences: UserPreferences, axiosCancel?: CancelTokenSource) {
        return this.putItemBySubURL(preferences, preferences.id.toString(), axiosCancel);
    }
}