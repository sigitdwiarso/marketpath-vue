import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";
import Progress from "@/components/ui/Progress.vue";
import SimBadge from "@/components/site/SimBadge.vue";
import Takeaway from "@/components/site/Takeaway.vue";
import { cn } from "@/lib/utils";

describe("ui components", () => {
  it("cn merges tailwind classes", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
    expect(cn("text-bull", false && "x", "font-bold")).toBe("text-bull font-bold");
  });

  it("Button renders as <button> by default with variant classes", async () => {
    const wrapper = mount(Button, { props: { variant: "outline" }, slots: { default: "Click" } });
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.text()).toBe("Click");
    expect(wrapper.html()).toContain("bg-background");
  });

  it("Button asChild renders the child anchor instead of a button", () => {
    const wrapper = mount(Button, {
      props: { asChild: true },
      slots: { default: '<a href="#fundamentals">Go</a>' },
    });
    expect(wrapper.find("button").exists()).toBe(false);
    expect(wrapper.find("a").exists()).toBe(true);
    expect(wrapper.find("a").attributes("href")).toBe("#fundamentals");
  });

  it("Badge supports the outline variant", () => {
    const wrapper = mount(Badge, { props: { variant: "outline" }, slots: { default: "Simulated" } });
    expect(wrapper.text()).toBe("Simulated");
  });

  it("Progress indicator reflects the value", () => {
    const wrapper = mount(Progress, { props: { modelValue: 40 } });
    const indicator = wrapper.find("[data-slot='progress-indicator']");
    expect(indicator.attributes("style")).toContain("translateX(-60%)");
  });

  it("SimBadge shows the default simulated-data label", () => {
    const wrapper = mount(SimBadge);
    expect(wrapper.text()).toContain("Simulated data — for education only");
  });

  it("Takeaway renders the Key takeaway callout", () => {
    const wrapper = mount(Takeaway, { slots: { default: "Survive first." } });
    expect(wrapper.text()).toContain("Key takeaway");
    expect(wrapper.text()).toContain("Survive first.");
  });
});
