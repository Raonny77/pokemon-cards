import Navbar from "@/components/Navbar";
import CardForm from "@/components/CardForm";

export default function NovoCardPage() {
  return (
    <>
      <Navbar />
      <div className="container form-page">
        <CardForm />
      </div>
    </>
  );
}
