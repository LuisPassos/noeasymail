import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";
import IsDisposable from "App/Services/IsDisposable";

export default class MailController {
  public async index({ request, response }: HttpContextContract) {
    const email = request.input("email");

    //TO DO Validate If Request is Well Formed with Validators
    if (!email) {
      return response.status(400).json({
        error: "No email property found.",
      });
    }

    let isEmail = true;
    let isDisposable = false;

    try {
      await validator.validate({
        schema: schema.create({
          email: schema.string([rules.email()]),
        }),
        data: {
          email,
        },
      });
    } catch (err) {
      isEmail = false;
    }

    if (isEmail) {
      isDisposable = IsDisposable.isEmailBlocked(email);
    }

    return response.status(200).json({
      isEmail,
      isDisposable,
    });
  }

  public async all({ request, response }: HttpContextContract) {
    const data = request.only(["emails"]);

    //TO DO Validate If Request is Well Formed with Validators
    if (!data.emails) {
      return response.status(400).json({
        error: "No array of Emails found.",
      });
    }

    if (!Array.isArray(data.emails)) {
        return response.status(400).json({
          error: "Emails property is not an Array.",
        });
    }

    if (data.emails.length > 150) {
        return response.status(400).json({
          error: "Emails length has more than 150 values.",
        });
    }

    let invalidEmail: any[] = [];
    let disposable: any[] = [];

    await Promise.all(
      data.emails.map(async (email: any) => {
        let isEmail = true;

        try {
          await validator.validate({
            schema: schema.create({
              email: schema.string([rules.email()]),
            }),
            data: {
              email,
            },
          });
        } catch (err) {
          invalidEmail.push(email);
          isEmail = false;
        }
        if (isEmail) {
          if (IsDisposable.isEmailBlocked(email)) {
            disposable.push(email);
          }
        }
      })
    );

    return response.status(200).json({
      invalidEmail,
      disposable,
    });
  }
}
