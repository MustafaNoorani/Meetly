"use client";

import { availabilitySchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "../data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateAvailability } from "@/actions/availability";

const AvailabilityForm = ({ initialData }) => {
    const { register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm({
        resolver: zodResolver(availabilitySchema),
        defaultValues: { ...initialData },
    });
    const { fn: fnupdateAvailability, loading, error} = useFetch(updateAvailability);
    const onSubmit = async (data) => {
        await fnupdateAvailability(data);
    };
    return (
          <form onSubmit={handleSubmit(onSubmit)}>
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",].map((day) => {
                const isAvailable = watch(`${day}.isAvailable`)
                return (
                    <div key={day} className="flex items-center space-x-4 mb-4">
                        <Controller
                            name={`${day}.isAvailable`}
                            control={control}
                            render={({ field }) => {
                                return <Checkbox checked={field.value} onCheckedChange={(checked) => {
                                    setValue(`${day}.isAvailable`, checked);
                                    if (!checked) {
                                        setValue(`${day}.startTime`, "09:00");
                                        setValue(`${day}.endTime`, "17:00");
                                    }

                                }} />
                            }}
                        />

                        <span className="w-24">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                        {isAvailable && (
                            <>
                                <Controller
                                    name={`${day}.startTime`}
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="Start Time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        );
                                    }}
                                />

                                <span>to</span>
                                <Controller
                                    name={`${day}.endTime`}
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="End Time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        );
                                    }}
                                />

                                {errors[day]?.endTime && (<span className="text-red-500 text-sm ml-2">{errors[day].endTime.message}</span>)}
                            </>

                        )}
                    </div>
                );
            })}
            <div className="flex items-center space-x-4">
                <span>Minimum gap before booking (minutes)</span>
                <Input type="number" {...register("timegap", { valueAsNumber: true })} className="w-32" />
                {errors.timegap && (<span className="text-red-500 text-sm ml-2">{errors.timegap.message}</span>)}

            </div>
            {error && (<span className="text-red-500 text-sm ml-2">{error.message}</span>)}

            <Button type="submit" className="mt-5 border-2 p-4 border-x-white font-medium border-spacing-3 bg-transparent text-gray-800 hover:text-white" disabled = {loading}>{loading ? "Updating..." : "Update Availability"}</Button>
        </form>
    );
}

export default AvailabilityForm