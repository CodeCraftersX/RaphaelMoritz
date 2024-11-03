import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdCall, MdSend } from "react-icons/md";
import {
  daysOfWeek,
  getDateFromNow,
  moment,
  months,
} from "../utils/dateFromNow";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface workDays {
  date: number;
  month: string;
  day: string;
}
interface availability {
  isWeekday?: boolean;
  isWithinTime?: boolean;
}
const responseFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  textContent: z
    .string()
    .min(10, "Text content must be at least 10 characters"),
  permission: z.boolean().refine((val) => val === true, {
    message: "Permission must be accepted",
  }),
});
type responseFormData = z.infer<typeof responseFormSchema>;

export function Contact() {
  const [workDays, setWorkDays] = useState<workDays[]>([]);
  const [isWorkingNow, setIsWorkingNow] = useState<availability>({});
  const responseForm = useRef<HTMLElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<responseFormData>({
    resolver: zodResolver(responseFormSchema),
  });

  const onSubmit: SubmitHandler<responseFormData> = (data) => {
    console.log("Form Data:", data);
  };

  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, index) => ({
      date: getDateFromNow(index).getUTCDate(),
      month: months[getDateFromNow(index).getUTCMonth()],
      day: daysOfWeek[getDateFromNow(index).getUTCDay()],
    }));

    setWorkDays(days);
  }, []);

  useEffect(() => {
    const tomorrow = {
      date: getDateFromNow().getUTCDate(),
      month: months[getDateFromNow().getUTCMonth()],
      day: daysOfWeek[getDateFromNow().getUTCDay()],
    };

    if (workDays.length > 0) {
      if (
        workDays[0].day.slice(0, 3).toLowerCase() !== "sat" &&
        workDays[0].day.slice(0, 3).toLowerCase() !== "sun"
      ) {
        const hour = getDateFromNow(0).getUTCHours() + 1;

        if (hour >= 7 && hour <= 18) {
          setIsWorkingNow({ isWeekday: true, isWithinTime: true });
        } else if (tomorrow.day.slice(0, 3).toLowerCase() === "sat") {
          setIsWorkingNow({ isWeekday: false });
        } else {
          setIsWorkingNow({ isWeekday: true, isWithinTime: false });
        }
      } else {
        setIsWorkingNow({ isWeekday: false });
      }
    }
  }, [workDays]);

  const scrollToResponseForm = useCallback(() => {
    responseForm.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <>
      <section className="flex flex-col gap-5 items-center justify-center box-border pb-10">
        <div
          className={
            "w-full h-fit p-2 text-center relative flex items-center justify-center pb-[-10px] gap-2 flex-col *:font-medium " +
            "after:content-[''] after:relative after:w-10 after:h-0.5 after:bg-red-500 after:rounded-full"
          }
        >
          <h2 className="text-xl min-[498px]:text-2xl sm:text-3xl">
            Need help?
          </h2>
          <h2 className="text-3xl min-[498px]:text-4xl sm:text-5xl">
            Let's Talk
          </h2>
        </div>

        <ul className="w-full flex items-start justify-center gap-2 flex-wrap p-2">
          <li className="w-full p-5 flex items-start justify-start flex-col gap-4 min-[498px]:w-56 sm:w-72 lg:w-96 shadow-sm shadow-black/15 rounded-md">
            <h4
              className={
                "text-base min-[498px]:text-lg sm:text-xl after:w-10 relative flex items-start justify-start gap-2 flex-col " +
                "after:content-[''] after:relative after:w-10 after:h-0.5 after:bg-red-500 after:rounded-full"
              }
            >
              Contact info
            </h4>

            <address className="text-sm min-[498px]:text-base sm:text-lg not-italic">
              375 University Ave, Suite 900 Toronto, ON, M5G 2J5
            </address>

            <a href="tel:+123456789010" className="w-fit h-fit">
              <Button
                variant="contained"
                className="!p-2 !text-xs min-[498px]:!text-sm sm:!text-base !px-4 !bg-black/90 hover:!bg-black/70 !text-white"
                startIcon={<MdCall />}
                disableElevation
              >
                (123) 456 789 010
              </Button>
            </a>
          </li>
          <li className="w-full p-5 flex items-start justify-start flex-col gap-4 min-[498px]:w-56 sm:w-72 lg:w-96 shadow-sm shadow-black/15 rounded-md">
            <h4
              className={
                "text-base min-[498px]:text-lg sm:text-xl after:w-10 relative flex items-start justify-start gap-2 flex-col " +
                "after:content-[''] after:relative after:w-10 after:h-0.5 after:bg-red-500 after:rounded-full"
              }
            >
              New clients
            </h4>
            <p className="text-sm min-[498px]:text-base sm:text-lg">
              Are you looking to speak with one of our family lawyers?
            </p>
            <Button
              variant="contained"
              className="!p-2 !text-xs min-[498px]:!text-sm sm:!text-base !px-4 !bg-black/90 hover:!bg-black/70 !text-white"
              startIcon={<MdCall />}
              disableElevation
              onClick={scrollToResponseForm}
            >
              Start Here
            </Button>
          </li>
        </ul>
        <section className="w-full px-2 py-10 bg-black/10 text-center text-lg">
          <p>
            {isWorkingNow.isWeekday ? (
              <>
                Good {moment(getDateFromNow(0).getUTCHours() + 1)}, We are
                currently not available until{" "}
                <span className="text-black/80 font-bold">
                  - come back tomorrow at 7am
                </span>
              </>
            ) : (
              <>
                Good {moment(getDateFromNow(0).getUTCHours() + 1)}, We are
                currently not available until{" "}
                <span className="text-black/80 font-bold">- monday at 7am</span>
              </>
            )}
          </p>
        </section>
      </section>

      <section className="flex flex-col gap-5 items-center justify-center box-border pb-10">
        <div
          className={
            "w-full h-fit p-2 text-center relative flex items-center justify-center pb-[-10px] gap-2 flex-col *:font-medium " +
            "after:content-[''] after:relative after:w-10 after:h-0.5 after:bg-red-500 after:rounded-full"
          }
        >
          <h2 className="text-xl min-[498px]:text-2xl sm:text-3xl">
            Office Hours
          </h2>
        </div>

        <ul className="w-full max-w-screen-md flex first:*:border-t-[1.5px] *:border-b-[1.5px] flex-col items-start justify-center flex-wrap p-2">
          {workDays.map((workDay, index) => (
            <li
              key={index}
              className="w-full box-border px-2 py-5 flex items-center hover:duration-200 hover:bg-black/5 justify-between gap-2 flex-wrap text-base min-[498px]:text-lg sm:text-xl capitalize"
            >
              <strong>
                {index == 0
                  ? "Today"
                  : `${workDay.day}, ${workDay.date} ${workDay.month.slice(0, 3)}`}
              </strong>
              <em className="not-italic">
                -{" "}
                {index == 0
                  ? workDay.day.slice(0, 3).toLowerCase() !== "sat" &&
                    workDay.day.slice(0, 3).toLowerCase() !== "sun" &&
                    isWorkingNow.isWithinTime
                    ? "Available 7am - 6pm"
                    : "Closed"
                  : workDay.day.slice(0, 3).toLowerCase() !== "sat" &&
                      workDay.day.slice(0, 3).toLowerCase() !== "sun"
                    ? "Available 7am - 6pm"
                    : "Closed"}
              </em>
            </li>
          ))}
        </ul>
      </section>
      <section
        ref={responseForm}
        className="w-full p-4 py-10 flex flex-col items-center justify-center gap-4 bg-black/10 text-center"
      >
        <div
          className={
            "w-full h-fit p-2 text-center relative flex items-center justify-center pb-[-10px] gap-2 flex-col *:font-medium " +
            "after:content-[''] after:relative after:w-10 after:h-0.5 after:bg-red-500 after:rounded-full"
          }
        >
          <h2 className="text-xl min-[498px]:text-2xl sm:text-3xl">
            Need Legal Advice?
          </h2>
          <h2 className="text-lg min-[498px]:text-xl sm:text-2xl">
            Book Consultation
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-screen-sm flex flex-wrap items-center justify-center gap-2"
        >
          <TextField
            className="w-full min-[498px]:w-[calc(50%-0.25rem)] bg-black/5 focus:!border-black/80 !outline-none"
            label="Name"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray", // Default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // Label color on focus
              },
            }}
            {...register("name")}
          />
          <TextField
            className="w-full min-[498px]:w-[calc(50%-0.25rem)] bg-black/5 focus:!border-black/80 !outline-none"
            label="Email"
            type="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                  borderWidth: 1,
                },
              },
              "& .MuiInputLabel-root": {
                color: "gray", // Default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // Label color on focus
              },
            }}
            {...register("email")}
          />

          <textarea
            className="w-full h-36 p-2 rounded-md border-[1px] bg-black/5 border-black/30 focus:border-black/80 outline-none resize-none placeholder:text-black/50"
            placeholder="How can we help you?"
            {...register("textContent")}
          ></textarea>

          <FormControlLabel
            className="w-full"
            control={
              <Checkbox
                sx={{
                  color: "black",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
                {...register("permission")}
              />
            }
            label="You give us permission to respond to you by email."
            sx={{
              "& .MuiFormControlLabel-label": {
                color: "black",
                textAlign: "left",
              },
            }}
          />
          <div className="w-full flex items-start justify-start">
            <Button
              variant="contained"
              className="w-full min-[498px]:w-fit !p-2 !px-4 !text-xs min-[498px]:!text-sm sm:!text-base !bg-black/90 hover:!bg-black/70 !text-white capitalize"
              startIcon={<MdSend />}
              disableElevation
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}