import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import { BASE_URL } from './util';

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to YOUR COMPANY!</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/logo.png`}
                  width="160"
                  height="48"
                  alt="YOUR COMPANY"
                  className="my-0 mx-auto"
                />
              </Section>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-base text-[14px] leading-[24px]">
                  Thanks for signing up for YOUR COMPANY.
                </Text>
              </Section>

              <Section className="mt-[16px] mb-[16px]">
                <Text className="text-black font-base text-left">
                  Feel free to send us an email at{' '}
                  <Link
                    href="mailto:_____"
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    YOUR EMAIL
                  </Link>{' '}
                  if you have any questions or have issues with your account.
                </Text>
              </Section>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full " />
              <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center">
                © 2024 YOUR COMPANY. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
